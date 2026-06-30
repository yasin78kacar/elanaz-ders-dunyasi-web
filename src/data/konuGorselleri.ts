// Konu (theme) -> görsel eşleştirmesi
// Sorunun "theme" alanına bakılır, eşleşen görsel quiz ekranında gösterilir.

export const konuGorselleri: { [konu: string]: string } = {
  // MATEMATİK
  'Zaman': 'A_simple_round_wall_clock_202606120944.jpeg',
  'Çarpma (1×1–10×10)': 'A_colorful_multiplication_table_grid_202606120944.jpeg',
  'Sayı Doğrusu': 'A_colorful_number_line_from_202606120944.jpeg',
  'Tartma': 'A_simple_balance_scale_on_202606120944.jpeg',
  'Uzunluk Ölçme': 'A_simple_colorful_ruler_showing_202606120944.jpeg',
  'Grafik Okuma': 'A_simple_bar_chart_on_202606120946.jpeg',
  'Tablo Okuma': 'A_simple_bar_chart_on_202606120946.jpeg',
  'Veri Toplama ve Yorumlama': 'A_simple_bar_chart_on_202606120946.jpeg',
  'Toplama (1-20)': 'Simple_addition_visual_on_white_202606120944.jpeg',
  'Zihinden Toplama': 'Simple_addition_visual_on_white_202606120944.jpeg',
  'Çıkarma (2-20)': 'Simple_subtraction_visual_on_white_202606120944.jpeg',
  'Zihinden Çıkarma': 'Simple_subtraction_visual_on_white_202606120944.jpeg',
  'Toplama ve Çıkarma Problemleri': 'Simple_addition_visual_on_white_202606120944.jpeg',
  'Bölme': 'Simple_division_visual_on_white_202606121001.jpeg',
  'Bölme (2-100)': 'Simple_division_visual_on_white_202606121001.jpeg',
  'Eşit Parçalara Bölme': 'Simple_division_visual_on_white_202606121001.jpeg',
  'Basit Kesirler': 'Three_fraction_visuals_in_a_202606120944.jpeg',
  'Yarım ve Çeyrek': 'Three_fraction_visuals_in_a_202606120944.jpeg',
  'Para Birimleri': 'Simple_Turkish_coins_and_banknotes_202606121001.jpeg',
  'Para ile Alışveriş': 'Simple_Turkish_coins_and_banknotes_202606121001.jpeg',
  'Onluk ve Birlik': 'Place_value_blocks_on_white_202606120945.jpeg',
  'Geometrik Şekil Modelleri': 'Five_flat_geometric_shapes_in_202606120945.jpeg',
  'Geometrik Cisim Modelleri': 'Six_3D_geometric_shapes_in_202606120945.jpeg',
  'Geometrik Cisimler': 'Six_3D_geometric_shapes_in_202606120945.jpeg',
  'Geometrik Cisim ve Şekillerin Biçimsel Özellikleri': 'Five_flat_geometric_shapes_in_202606120945.jpeg',
  'Örüntü': 'Three_rows_of_repeating_patterns_202606120944.jpeg',

  // TÜRKÇE
  'Harfler': 'Turkish_alphabet_display_on_white_202606121037.jpeg',
  'Yazı': 'Turkish_alphabet_display_on_white_202606121037.jpeg',
  'Ses Bilgisi': 'Eight_Turkish_vowels_highlighted_on_202606121037.jpeg',
  'Sesler ve Heceler': 'Simple_syllable_table_on_white_202606121036.jpeg',
  'Noktalama': 'Six_punctuation_marks_on_white_202606121018.jpeg',
  'Noktalama ve Yazım': 'Six_punctuation_marks_on_white_202606121018.jpeg',
};

export function gorselBul(theme: string): string | null {
  if (!theme) return null;
  if (konuGorselleri[theme]) return '/gorseller/' + konuGorselleri[theme];
  for (const konu in konuGorselleri) {
    if (theme.toLowerCase().includes(konu.toLowerCase())) {
      return '/gorseller/' + konuGorselleri[konu];
    }
  }
  return null;
}
