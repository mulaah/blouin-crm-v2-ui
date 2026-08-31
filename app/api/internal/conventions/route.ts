import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await query(`
      SELECT
        c.id,
        c.matter_number,
        c.status,
        CASE
          WHEN c.status = 'in_preparation' THEN 'En préparation'
          WHEN c.status = 'sent' THEN 'Envoyée'
          WHEN c.status = 'accepted' THEN 'Acceptée'
          WHEN c.status = 'refused' THEN 'Refusée'
          ELSE c.status
        END as status_label,
        c.programme_code,
        ll_prog.label as programme_label,
        c.montant_ttc,
        c.montant_ht,
        c.date_signature,
        pp.first_name,
        pp.last_name,
        pp.prospect_number,
        s.first_name as technicien_first_name,
        s.last_name as technicien_last_name
      FROM conventions c
      JOIN prospects_persons pp ON c.prospect_id = pp.id
      LEFT JOIN staff s ON c.technicien_id = s.id
      LEFT JOIN lookup_values lv_prog ON c.programme_code = lv_prog.code
        AND lv_prog.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'program')
      LEFT JOIN lookup_labels ll_prog ON lv_prog.id = ll_prog.value_id AND ll_prog.language = 'fr'
      ORDER BY c.date_signature DESC NULLS LAST
      LIMIT 100
    `);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching conventions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
