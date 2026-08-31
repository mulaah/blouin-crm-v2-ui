import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await query(`
      SELECT
        v.id,
        v.numero_versement,
        v.statut,
        v.montant_versement_ttc,
        v.date_echeance,
        v.date_paiement,
        v.facture_envoyee,
        v.date_facture_envoyee,
        c.matter_number,
        pp.first_name,
        pp.last_name
      FROM versements v
      JOIN conventions c ON v.convention_id = c.id
      JOIN prospects_persons pp ON c.prospect_id = pp.id
      ORDER BY v.created_at DESC
      LIMIT 100
    `);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching versements:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
