// Konu (theme) -> görsel eşleştirmesi
// Sorunun "theme" alanına bakılır, eşleşen görsel quiz ekranında gösterilir.

export const konuGorselleri: { [konu: string]: string } = {
  // MATEMATİK
  'Zaman': 'A_simple_round_wall_clock_202606120944.jpeg',
  'Sayı Doğrusu': 'A_colorful_number_line_from_202606120944.jpeg',
  'Tartma': 'A_simple_balance_scale_on_202606120944.jpeg',
  'Uzunluk Ölçme': 'A_simple_colorful_ruler_showing_202606120944.jpeg',
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

  // FEN BİLİMLERİ
  'Hayvanlar': 'Eight_simple_animals_in_a_202606121001.jpeg',
  'Canlılar': 'Eight_simple_animals_in_a_202606121001.jpeg',
  'Canlıların Sınıflandırılması': 'Eight_simple_animals_in_a_202606121001.jpeg',
  'Bitkiler': 'Five_simple_food_and_nature_202606120945.jpeg',
  'Hava Durumu ve Mevsimler': 'Six_weather_icons_in_a_202606121002.jpeg',
  'İnsan ve Sağlık': 'Simple_body_outline_on_white_202606121001.jpeg',
  'Sağlıklı Yaşam ve Çevre': 'Six_healthy_habits_icons_in_202606121002.jpeg',
  'Dünya ve Evren': 'Simple_flat_world_map_on_202606121017.jpeg',
  'Yer ve Uzay': 'Simple_flat_world_map_on_202606121017.jpeg',

  // HAYAT BİLGİSİ
  'Aile': 'Simple_family_illustration_on_white_202606120944.jpeg',
  'Aile ve Arkadaşlık': 'Simple_family_illustration_on_white_202606120944.jpeg',
  'Aile ve Duygular': 'Simple_family_illustration_on_white_202606120944.jpeg',
  'Duygular': 'Six_emotion_faces_in_a_202606121002.jpeg',
  'Ev': 'Six_room_house_vocabulary_images_in_202606121036.jpeg',
  'Meslekler ve Çalışma Hayatı': 'Six_profession_characters_in_a_202606121002.jpeg',
  'Okul': 'A_cheerful_colorful_classroom_scene_202606121001.jpeg',
  'Okul ve Sınıf': 'A_cheerful_colorful_classroom_scene_202606121001.jpeg',
  'Sağlık ve Temizlik': 'Six_healthy_habits_icons_in_202606121002.jpeg',
  'Doğal Afetler ve Korunma': 'Four_natural_disaster_icons_in_202606121002.jpeg',
  'Toplum ve Çevre': 'Simple_recycling_visual_on_white_202606121018.jpeg',
  'Çevre': 'Simple_recycling_visual_on_white_202606121018.jpeg',
  'Güvenli Yaşam': 'Six_simple_traffic_signs_on_202606120944.jpeg',
  'Güvenlik': 'Six_simple_traffic_signs_on_202606120944.jpeg',
  'Ülkemiz ve Vatandaşlık': 'Simple_colorful_map_of_Turkey_202606121017.jpeg',

  // İNGİLİZCE
  'Animals': 'Eight_simple_animals_in_a_202606121001.jpeg',
  'Colors': 'Eight_color_swatches_with_labels_202606120943.jpeg',
  'Alphabet and Colors': 'Eight_color_swatches_with_labels_202606120943.jpeg',
  'Weather': 'Six_weather_icons_in_a_202606121002.jpeg',
  'Seasons': 'Four_season_scenes_in_a_202606120944.jpeg',
  'Body Parts': 'Simple_body_outline_on_white_202606121001.jpeg',
  'Feelings': 'Six_emotion_faces_in_a_202606121002.jpeg',
  'Jobs': 'Six_profession_characters_in_a_202606121002.jpeg',
  'Transport': 'Six_transportation_vehicles_in_a_202606121002.jpeg',
  'Sports': 'Four_children_playing_sports_on_202606121035.jpeg',
  'Rooms': 'Six_room_house_vocabulary_images_in_202606121036.jpeg',
  'Food and Drinks': 'Five_food_group_icons_in_202606121036.jpeg',
  'Fruits': 'Ten_fruits_and_vegetables_in_202606121002.jpeg',
  'Clothes': 'Eight_clothing_items_in_2_202606121036.jpeg',
  'Greetings and Family': 'Simple_family_illustration_on_white_202606120944.jpeg',
  'Shapes': 'Five_flat_geometric_shapes_in_202606120945.jpeg',
  'Numbers and Classroom': 'Eight_simple_school_objects_in_202606120943.jpeg',
  'School Subjects': 'Eight_simple_school_objects_in_202606120943.jpeg',

  // GÖRSEL SANATLAR
  'Renk Teorisi': 'Eight_color_swatches_with_labels_202606120943.jpeg',
  'Form ve Çizgi': 'Five_flat_geometric_shapes_in_202606120945.jpeg',

  // ZEKA-DİKKAT
  'Şekil Örüntüleri': 'Three_rows_of_repeating_patterns_202606120944.jpeg',
  'Renk Örüntüleri': 'Three_rows_of_repeating_patterns_202606120944.jpeg',
  'Karma Örüntü': 'Three_incomplete_patterns_on_white_202606121018.jpeg',
  'Sayı Örüntüleri (Artan)': 'Three_incomplete_patterns_on_white_202606121018.jpeg',
  'Sayı Örüntüleri (Azalan)': 'Three_incomplete_patterns_on_white_202606121018.jpeg',
  'Farklı Olanı Bulma — Şekil': 'Five_flat_geometric_shapes_in_202606120945.jpeg',
  'İleri Zeka Bulmacaları': 'A_simple_maze_on_white_202606120943.jpeg',
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
