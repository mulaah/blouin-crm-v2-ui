import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const consultationId = params.id;

    // Consultation complète
    const consultationResult = await query(
      `SELECT
        c.*,
        pp.first_name as prospect_first_name,
        pp.last_name as prospect_last_name,
        pp.email as prospect_email,
        pp.phone as prospect_phone,
        pp.prospect_number,
        s.first_name as avocate_first_name,
        s.last_name as avocate_last_name,
        s.email as avocate_email
      FROM consultations c
      JOIN prospects_persons pp ON c.prospect_id = pp.id
      LEFT JOIN staff s ON c.avocate_id = s.id
      WHERE c.id = $1`,
      [consultationId]
    );

    if (consultationResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Consultation not found' },
        { status: 404 }
      );
    }

    const consultation = consultationResult.rows[0];

    // Prospect info
    const prospectResult = await query(
      `SELECT * FROM prospects_persons WHERE id = $1`,
      [consultation.prospect_id]
    );

    return NextResponse.json({
      success: true,
      data: {
        consultation,
        prospect: prospectResult.rows[0] || null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching consultation:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
