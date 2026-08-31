import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { prospect_id: string } }
) {
  try {
    const prospectId = params.prospect_id;

    // Prospect info
    const prospectResult = await query(
      `SELECT * FROM prospects_persons WHERE id = $1`,
      [prospectId]
    );

    if (prospectResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prospect not found' },
        { status: 404 }
      );
    }

    // All consultations for this prospect
    const consultationsResult = await query(
      `SELECT
        c.id,
        c.date_rdv,
        c.heure_rdv,
        c.duree,
        c.prix_ht,
        c.prix_ttc,
        c.paiement_statut,
        CASE
          WHEN c.paiement_statut = 'paid' THEN 'Payée'
          WHEN c.paiement_statut = 'pending' THEN 'Non payée'
          ELSE c.paiement_statut
        END as paiement_statut_label,
        c.date_paiement,
        c.type_consultation,
        c.notes_avocate,
        s.first_name as avocate_first_name,
        s.last_name as avocate_last_name,
        s.email as avocate_email
      FROM consultations c
      LEFT JOIN staff s ON c.avocate_id = s.id
      WHERE c.prospect_id = $1
      ORDER BY c.date_rdv DESC`,
      [prospectId]
    );

    return NextResponse.json({
      success: true,
      data: {
        prospect: prospectResult.rows[0],
        consultations: consultationsResult.rows,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching prospect consultations:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
