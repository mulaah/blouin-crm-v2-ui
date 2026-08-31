import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await query(`
      SELECT
        pp.id as prospect_id,
        pp.prospect_number,
        pp.first_name,
        pp.last_name,
        pp.email,
        COUNT(c.id) as consultation_count,
        MAX(c.date_rdv) as derniere_consultation,
        STRING_AGG(DISTINCT s.first_name || ' ' || s.last_name, ', ') as avocates_list
      FROM prospects_persons pp
      LEFT JOIN consultations c ON pp.id = c.prospect_id
      LEFT JOIN staff s ON c.avocate_id = s.id
      WHERE c.id IS NOT NULL
      GROUP BY pp.id, pp.prospect_number, pp.first_name, pp.last_name, pp.email
      ORDER BY MAX(c.date_rdv) DESC
      LIMIT 100
    `);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
