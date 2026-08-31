import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const conventionId = params.id;

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
        c.categorie_code,
        ll_cat.label as categorie_label,
        c.type_dossier_code,
        ll_type.label as type_dossier_label,
        c.consultation_option_code,
        ll_consultation.label as consultation_option_label,
        c.montant_ht,
        c.montant_tps,
        c.montant_tvq,
        c.montant_ttc,
        c.date_signature,
        c.created_at,
        c.updated_at,
        pp.first_name as prospect_first_name,
        pp.last_name as prospect_last_name,
        pp.prospect_number,
        pp.email as prospect_email,
        pp.phone as prospect_phone,
        s.first_name as technicien_first_name,
        s.last_name as technicien_last_name,
        s.email as technicien_email
      FROM conventions c
      JOIN prospects_persons pp ON c.prospect_id = pp.id
      LEFT JOIN staff s ON c.technicien_id = s.id
      LEFT JOIN lookup_values lv_prog ON c.programme_code = lv_prog.code
        AND lv_prog.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'program')
      LEFT JOIN lookup_labels ll_prog ON lv_prog.id = ll_prog.value_id AND ll_prog.language = 'fr'
      LEFT JOIN lookup_values lv_cat ON c.categorie_code = lv_cat.code
        AND lv_cat.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'client_category')
      LEFT JOIN lookup_labels ll_cat ON lv_cat.id = ll_cat.value_id AND ll_cat.language = 'fr'
      LEFT JOIN lookup_values lv_type ON c.type_dossier_code = lv_type.code
        AND lv_type.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'dossier_type_pricing')
      LEFT JOIN lookup_labels ll_type ON lv_type.id = ll_type.value_id AND ll_type.language = 'fr'
      LEFT JOIN lookup_values lv_consultation ON c.consultation_option_code = lv_consultation.code
        AND lv_consultation.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'consultation_option')
      LEFT JOIN lookup_labels ll_consultation ON lv_consultation.id = ll_consultation.value_id AND ll_consultation.language = 'fr'
      WHERE c.id = $1
    `, [conventionId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Convention not found' },
        { status: 404 }
      );
    }

    const convention = result.rows[0];

    const versementsResult = await query(
      `SELECT * FROM versements WHERE convention_id = $1 ORDER BY numero_versement ASC`,
      [conventionId]
    );

    return NextResponse.json({
      success: true,
      data: {
        convention,
        versements: versementsResult.rows || [],
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching convention:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
