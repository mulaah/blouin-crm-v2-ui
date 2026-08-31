import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await query(`
      SELECT
        p.id,
        p.prospect_number,
        p.first_name,
        p.last_name,
        p.email,
        p.phone,
        p.program_code,
        ll_program.label as program_label,
        p.contact_date,
        p.created_at,
        (SELECT ll.label FROM conventions c
         LEFT JOIN lookup_values lv ON c.type_dossier_code = lv.code
           AND lv.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'dossier_type_pricing')
         LEFT JOIN lookup_labels ll ON lv.id = ll.value_id AND ll.language = 'fr'
         WHERE c.prospect_id = p.id
         ORDER BY c.created_at DESC LIMIT 1) as type_dossier_label,
        (SELECT ll.label FROM conventions c
         LEFT JOIN lookup_values lv ON c.categorie_code = lv.code
           AND lv.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'client_category')
         LEFT JOIN lookup_labels ll ON lv.id = ll.value_id AND ll.language = 'fr'
         WHERE c.prospect_id = p.id
         ORDER BY c.created_at DESC LIMIT 1) as categorie_label,
        (SELECT con.paiement_statut FROM consultations con
         WHERE con.prospect_id = p.id
         ORDER BY con.date_rdv DESC LIMIT 1) as derniere_consultation_paiement_statut
      FROM prospects_persons p
      LEFT JOIN lookup_values lv_program ON p.program_code = lv_program.code
        AND lv_program.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'program')
      LEFT JOIN lookup_labels ll_program ON lv_program.id = ll_program.value_id AND ll_program.language = 'fr'
      ORDER BY p.created_at DESC
      LIMIT 100
    `);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching prospects:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
