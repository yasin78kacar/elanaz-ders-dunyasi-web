#!/usr/bin/env node
// generate_questions.mjs — 2. Sınıf Soru Üretici
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, 'public', 'data');

let _id = 1;
const uid = () => `q${_id++}`;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function q(subj, theme, text, correct, wrongs) {
  const c = String(correct);
  const ws = [...new Set(wrongs.map(String).filter(w => w !== c && w !== 'null' && w !== 'undefined'))];
  while (ws.length < 3) ws.push(String(Number(c.replace(/[^0-9.-]/g,'') || 0) + ws.length + 7));
  const opts = shuffle([c, ...ws.slice(0, 3)]);
  return { id: uid(), subject: subj, theme, question: text, options: opts, correctAnswer: opts.indexOf(c) };
}

function save(folder, file, questions) {
  const dir = join(BASE, folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, file), JSON.stringify({ questions }, null, 2), 'utf-8');
  console.log(`✅ ${questions.length} soru → ${folder}/${file}`);
}

// ================================================================
// MATEMATİK
// ================================================================

function mathTema1() {
  const qs = [], S = 'Matematik', T = 'Tema 1';
  // Basamak değerleri
  for (let n = 10; n <= 99; n += 3) {
    const t = Math.floor(n/10), o = n%10;
    qs.push(q(S,T,`${n} sayısının onlar basamağındaki rakam nedir?`, t, [t===1?2:1, (t+2)%9+1, t===9?7:9]));
    qs.push(q(S,T,`${n} sayısının birler basamağındaki rakam nedir?`, o, [o===0?1:0, (o+3)%10, (o+6)%10]));
  }
  // Sonra/önce gelen sayı
  for (let n = 1; n <= 50; n += 3) {
    qs.push(q(S,T,`${n} sayısından hemen sonra gelen sayı hangisidir?`, n+1, [n, n+2, n+3]));
  }
  for (let n = 51; n <= 99; n += 4) {
    qs.push(q(S,T,`${n} sayısından hemen önce gelen sayı hangisidir?`, n-1, [n, n-2, n+1]));
  }
  // Karşılaştırma
  const pairs = [[12,21],[34,43],[56,65],[78,87],[90,9],[45,54],[17,71],[38,83],[25,52],[46,64],[19,91],[27,72],[63,36],[48,84],[55,50]];
  for (const [a,b] of pairs) {
    qs.push(q(S,T,`${a} ile ${b} sayılarından hangisi daha büyüktür?`, Math.max(a,b), [Math.min(a,b), Math.max(a,b)+1, Math.min(a,b)-1]));
    qs.push(q(S,T,`${a} ile ${b} sayılarından hangisi daha küçüktür?`, Math.min(a,b), [Math.max(a,b), Math.min(a,b)+1, Math.max(a,b)+1]));
  }
  // Basamak sayısı
  for (let n = 1; n <= 9; n++) qs.push(q(S,T,`${n} sayısı kaç basamaklıdır?`, 1, [2,3,4]));
  for (let n of [10,20,30,40,50,60,70,80,90,99]) qs.push(q(S,T,`${n} sayısı kaç basamaklıdır?`, 2, [1,3,4]));
  qs.push(q(S,T,'100 sayısı kaç basamaklıdır?', 3, [1,2,4]));
  // Diziler
  const seqs = [
    [[2,4,6,'___',10], 8],[5,10,15,'___',25], [10,20,30,'___',50],
    [[3,6,9,'___',15], 12],[[1,3,5,'___',9], 7],[[25,30,35,'___',45], 40],
    [[50,45,40,'___',30], 35],[[4,8,12,'___',20], 16],[[7,14,21,'___',35], 28]
  ];
  for (const item of seqs) {
    if (Array.isArray(item[0])) {
      const [seq, ans] = item;
      qs.push(q(S,T,`${seq.join(', ')} — boşluğa hangi sayı gelir?`, ans, [ans-1, ans+1, ans+2]));
    }
  }
  return qs.slice(0, 200);
}

function mathTema2() {
  const qs = [], S = 'Matematik', T = 'Tema 2';
  // Tek + tek
  for (let a = 1; a <= 9; a++)
    for (let b = 1; b <= 9; b++) {
      const s = a+b;
      qs.push(q(S,T,`${a} + ${b} = ?`, s, [s+1, s-1, s+2]));
    }
  // Çift + tek
  const dsPairs = [[10,5],[12,7],[15,8],[18,3],[20,9],[21,6],[25,4],[30,7],[33,8],[35,6],[40,9],[42,5],[45,7],[48,2],[50,8],[55,6],[60,9],[62,3],[65,8],[70,5]];
  for (const [a,b] of dsPairs) qs.push(q(S,T,`${a} + ${b} = ?`, a+b, [a+b+1, a+b-1, a+b+10]));
  // Çift + çift
  const ddPairs = [[10,20],[11,22],[12,13],[20,30],[21,14],[23,32],[24,15],[30,40],[31,28],[35,15],[40,50],[41,38],[45,25],[50,20],[51,29],[55,15],[60,30],[70,20],[80,15],[12,38]];
  for (const [a,b] of ddPairs) if (a+b<=100) qs.push(q(S,T,`${a} + ${b} = ?`, a+b, [a+b+1, a+b-1, a+b+10]));
  // Onlar toplamı
  for (let a=10; a<=50; a+=10)
    for (let b=10; b<=50; b+=10)
      if (a+b<=100) qs.push(q(S,T,`${a} + ${b} = ?`, a+b, [a+b+10, a+b-10, a+b+5]));
  // Sözel sorular
  const wps = [
    ["Ayşe'nin 8 kalemi, Ali'nin 7 kalemi var. Toplam kaç kalem?", 15, [13,14,16]],
    ["Sepette 12 elma, 9 armut var. Toplam kaç meyve?", 21, [19,20,23]],
    ["Sınıfta 17 kız, 13 erkek var. Toplam kaç öğrenci?", 30, [28,29,32]],
    ["Dün 14, bugün 16 sayfa okudum. Toplam kaç sayfa?", 30, [28,29,31]],
    ["Bahçede 24 kırmızı, 16 sarı çiçek var. Toplam?", 40, [38,39,42]],
    ["Kütüphanede 44 roman, 36 hikâye kitabı var. Toplam?", 80, [78,79,82]],
    ["33 + 27 işleminin sonucu kaçtır?", 60, [58,59,62]],
    ["Otobüste 27 yolcu vardı, 18 bindi. Toplam?", 45, [43,44,47]],
    ["Elanaz'ın 13 fındığı, 7 cevizi var. Toplam?", 20, [18,19,21]],
    ["Markette 35 liralık, 25 liralık iki ürün aldım. Toplam?", 60, [55,58,65]],
  ];
  for (const [t,a,w] of wps) qs.push(q(S,T,t,a,w));
  // Eksik toplanan
  const mas = [["? + 5 = 12",7,[5,6,8]],["8 + ? = 15",7,[6,8,9]],["? + 20 = 45",25,[20,24,26]],
    ["13 + ? = 30",17,[13,16,18]],["? + 35 = 60",25,[23,26,35]],["40 + ? = 70",30,[20,29,40]],
    ["? + 28 = 55",27,[25,26,28]],["16 + ? = 40",24,[16,22,26]],["? + 43 = 80",37,[35,36,43]],["52 + ? = 100",48,[46,50,52]]];
  for (const [t,a,w] of mas) qs.push(q(S,T,t,a,w));
  return qs.slice(0, 200);
}

function mathTema3() {
  const qs = [], S = 'Matematik', T = 'Tema 3';
  // Tek basamak çıkarma
  for (let a=2; a<=9; a++)
    for (let b=1; b<a; b++) {
      const d = a-b;
      qs.push(q(S,T,`${a} - ${b} = ?`, d, [d+1, d-1 < 0 ? d+2 : d-1, d+2]));
    }
  // Teen - tek
  for (let a=10; a<=18; a++)
    for (let b=1; b<=a-1 && b<=9; b++) {
      const d = a-b;
      qs.push(q(S,T,`${a} - ${b} = ?`, d, [d+1, Math.max(0,d-1), d+2]));
    }
  // Çift - tek
  const dsPairs = [[20,7],[25,6],[30,8],[35,9],[40,7],[45,6],[50,8],[55,3],[60,7],[65,8],[70,3],[75,6],[80,9],[85,4],[90,7],[95,6],[99,4],[88,5],[77,3],[66,8]];
  for (const [a,b] of dsPairs) qs.push(q(S,T,`${a} - ${b} = ?`, a-b, [a-b+1, a-b-1, a-b+10]));
  // Çift - çift
  const ddPairs = [[20,10],[30,20],[40,30],[50,40],[60,50],[70,60],[80,70],[90,80],[100,50],[35,15],[45,25],[55,35],[65,45],[75,25],[85,45],[95,35],[48,23],[67,34],[89,56],[76,43]];
  for (const [a,b] of ddPairs) qs.push(q(S,T,`${a} - ${b} = ?`, a-b, [a-b+1, a-b-1, a-b+10]));
  // Sözel
  const wps = [
    ["Ali'nin 15 kalemi vardı, 7'sini verdi. Kaç kaldı?",8,[6,7,9]],
    ["Sepette 20 elma vardı, 8'i yendi. Kaç kaldı?",12,[10,11,13]],
    ["Sınıfta 30 öğrenci vardı, 12'si gitti. Kaç kaldı?",18,[16,17,19]],
    ["Kumbarada 50 lira vardı, 25 harcandı. Kaç kaldı?",25,[20,23,27]],
    ["100 - 37 = ?",63,[61,62,64]],
    ["Kitap 85 sayfa. 40 sayfa okundu. Kaç sayfa kaldı?",45,[43,44,46]],
    ["Bahçede 60 çiçek vardı. 28'i soldu. Kaç kaldı?",32,[30,31,33]],
    ["100 lira verildi, 75 lira harcandı. Para üstü kaç?",25,[23,24,26]],
    ["72 - 28 = ?",44,[42,43,45]],
    ["91 - 45 = ?",46,[44,45,47]],
  ];
  for (const [t,a,w] of wps) qs.push(q(S,T,t,a,w));
  // Eksik çıkan
  const ms = [["20 - ? = 13",7,[5,6,8]],["30 - ? = 22",8,[6,7,9]],["50 - ? = 35",15,[13,14,16]],
    ["? - 14 = 26",40,[38,39,41]],["? - 25 = 50",75,[70,73,80]]];
  for (const [t,a,w] of ms) qs.push(q(S,T,t,a,w));
  return qs.slice(0, 200);
}

function mathTema4() {
  const qs = [], S = 'Matematik', T = 'Tema 4';
  const ops = [
    [45,'+',[23],68],[67,'-',[34],33],[53,'+',[27],80],[81,'-',[46],35],[24,'+',[38],62],
    [90,'-',[55],35],[36,'+',[47],83],[72,'-',[39],33],[18,'+',[65],83],[84,'-',[27],57],
    [29,'+',[43],72],[76,'-',[48],28],[55,'+',[35],90],[97,'-',[63],34],[12,'+',[78],90],
    [65,'-',[28],37],[43,'+',[39],82],[88,'-',[45],43],[57,'+',[26],83],[74,'-',[37],37],
    [31,'+',[59],90],[93,'-',[57],36],[26,'+',[48],74],[85,'-',[39],46],[19,'+',[73],92],
    [78,'-',[44],34],[37,'+',[46],83],[69,'-',[33],36],[48,'+',[32],80],[75,'-',[28],47],
    [22,'+',[68],90],[83,'-',[41],42],[47,'+',[33],80],[96,'-',[54],42],[34,'+',[56],90],
    [71,'-',[29],42],[58,'+',[22],80],[89,'-',[47],42],[16,'+',[74],90],[62,'-',[18],44],
  ];
  for (const [a, op, _, ans] of ops)
    qs.push(q(S,T,`${a} ${op} ${_[0]} = ?`, ans, [ans+1, ans-1, ans+10]));
  // Sözel karışık
  const wps = [
    ["Bugün 25, dün 18 elma yedik. Toplam kaç?",43,[41,42,44]],
    ["30 kuş vardı, 12'si uçtu. Kaç kuş kaldı?",18,[16,17,19]],
    ["Ahmet 45, Ayşe 38 sayfa okudu. Ahmet kaç sayfa fazla?",7,[5,6,8]],
    ["100 - 55 + 20 = ?",65,[60,63,70]],
    ["15 + 25 - 10 = ?",30,[28,29,32]],
    ["Sınıfta 35 öğrenci var. 8'i geldi, 5'i gitti. Kaç öğrenci var?",38,[36,37,39]],
    ["Mağazada 56 tişört vardı. 23'ü satıldı, 14 yeni geldi. Kaç tişört var?",47,[45,46,48]],
    ["Markette 50 lira harcandı, 25 lira iade edildi. Net harcama?",25,[20,23,27]],
    ["48 + 12 - 20 = ?",40,[38,39,42]],
    ["70 - 35 + 15 = ?",50,[48,49,52]],
  ];
  for (const [t,a,w] of wps) qs.push(q(S,T,t,a,w));
  return qs.slice(0, 200);
}

function mathTema5() {
  const qs = [], S = 'Matematik', T = 'Tema 5';
  const shapeQs = [
    ["Üçgenin kaç kenarı vardır?","3",["4","5","2"]],
    ["Karenin kaç kenarı vardır?","4",["3","5","6"]],
    ["Dikdörtgenin kaç kenarı vardır?","4",["3","5","6"]],
    ["Beşgenin kaç kenarı vardır?","5",["4","6","7"]],
    ["Altıgenin kaç kenarı vardır?","6",["4","5","7"]],
    ["Dairenin kaç kenarı vardır?","0",["1","2","3"]],
    ["Üçgenin kaç köşesi vardır?","3",["4","2","5"]],
    ["Karenin kaç köşesi vardır?","4",["3","5","6"]],
    ["Dikdörtgenin kaç köşesi vardır?","4",["3","5","6"]],
    ["Karenin tüm kenarları nasıldır?","Eşittir",["Farklıdır","İki eşit çift","Hiçbiri eşit değil"]],
    ["Hangi şekil yuvarlanabilir?","Küre",["Küp","Kare","Üçgen"]],
    ["Küpün kaç yüzü vardır?","6",["4","5","8"]],
    ["Karenin kaç simetri ekseni vardır?","4",["1","2","8"]],
    ["Dikdörtgenin kaç simetri ekseni vardır?","2",["1","4","0"]],
    ["Dairenin simetri ekseni kaç tanedir?","Sonsuz",["1","2","4"]],
    ["Üçgenin iç açıları toplamı kaç derecedir?","180",["90","270","360"]],
    ["Karenin her köşe açısı kaç derecedir?","90",["45","60","120"]],
    ["Tam daire kaç derecedir?","360",["90","180","270"]],
    ["Hangi şeklin alt ve üst tabanı dairedir?","Silindir",["Küre","Koni","Küp"]],
    ["Koninin kaç köşesi vardır?","1",["0","2","3"]],
    ["Dikdörtgenler prizmasının kaç yüzü vardır?","6",["4","8","12"]],
    ["Hangi harf simetrik değildir?","F",["A","M","H"]],
    ["□ △ □ △ □ ___ sırada hangi şekil gelir?","△",["□","○","◇"]],
    ["○ ○ □ ○ ○ □ ___ sırada hangi şekil gelir?","○",["□","△","◇"]],
    ["△ △ △ □ △ △ △ ___ sırada hangi şekil gelir?","□",["△","○","◇"]],
    ["Karenin alanı nasıl hesaplanır?","Kenar × Kenar",["Kenar + Kenar","Kenar ÷ Kenar","Kenar × 2"]],
    ["Dikdörtgenin çevresi nasıl hesaplanır?","2 × (boy + en)",["boy + en","boy × en","2 × boy"]],
    ["Bir karenin kenarı 5 cm ise çevresi kaç cm?","20",["15","10","25"]],
    ["Bir karenin kenarı 3 cm ise alanı kaç cm²?","9",["6","12","3"]],
    ["Bir dikdörtgenin boyu 6, eni 4 cm ise çevresi kaç cm?","20",["10","24","18"]],
    ["Bir dikdörtgenin boyu 8, eni 3 cm ise alanı kaç cm²?","24",["22","11","16"]],
    ["Küre kaç boyutludur?","3",["1","2","4"]],
    ["Kare kaç boyutludur?","2",["1","3","4"]],
    ["Hangi şekil keskin köşesi olmayan 2 boyutlu şekildir?","Daire",["Kare","Üçgen","Beşgen"]],
    ["Bir karenin kenarı 7 cm ise çevresi kaç cm?","28",["21","35","14"]],
    ["Bir karenin kenarı 4 cm ise alanı kaç cm²?","16",["8","12","20"]],
    ["Bir karenin kenarı 6 cm ise çevresi kaç cm?","24",["18","12","30"]],
    ["Bir dikdörtgenin boyu 10, eni 5 cm ise alanı kaç cm²?","50",["15","25","100"]],
    ["Bir dikdörtgenin boyu 7, eni 3 cm ise çevresi kaç cm?","20",["10","21","14"]],
    ["Paralel iki kenar hangi şekillerde bulunur?","Dikdörtgen ve kare",["Üçgen","Daire","Beşgen"]],
    ["Hangi şekilin 4 eşit kenarı ve 4 dik açısı vardır?","Kare",["Dikdörtgen","Eşkenar üçgen","Beşgen"]],
    ["Dikdörtgende hangi kenarlar eşittir?","Karşılıklı kenarlar",["Bütün kenarlar","Hiçbir kenar","Komşu kenarlar"]],
  ];
  for (const [t,a,w] of shapeQs) qs.push(q(S,T,t,a,w));
  // Perimeter/area with numbers
  for (let s = 2; s <= 9; s++) {
    qs.push(q(S,T,`Kenarı ${s} cm olan karenin çevresi kaç cm?`, s*4, [s*3, s*4+4, s*2]));
    qs.push(q(S,T,`Kenarı ${s} cm olan karenin alanı kaç cm²?`, s*s, [s*4, s*s+2, s*2]));
  }
  for (let l=3; l<=7; l++)
    for (let w=2; w<l; w++) {
      qs.push(q(S,T,`Boyu ${l} cm, eni ${w} cm dikdörtgenin alanı kaç cm²?`, l*w, [l*w+2, l*w-2, (l+w)*2]));
      if (qs.length >= 200) break;
    }
  return qs.slice(0, 200);
}

function mathTema6() {
  const qs = [], S = 'Matematik', T = 'Tema 6';
  const timeQs = [
    ["Bir haftada kaç gün vardır?","7",["5","6","8"]],
    ["Bir günde kaç saat vardır?","24",["12","16","20"]],
    ["Bir saatte kaç dakika vardır?","60",["30","45","90"]],
    ["Bir dakikada kaç saniye vardır?","60",["30","45","100"]],
    ["Bir yılda kaç ay vardır?","12",["10","11","13"]],
    ["Bir yılda kaç gün vardır?","365",["360","364","366"]],
    ["Haftanın ilk günü hangisidir?","Pazartesi",["Pazar","Salı","Çarşamba"]],
    ["Haftanın son günü hangisidir?","Pazar",["Cumartesi","Pazartesi","Cuma"]],
    ["Yılın ilk ayı hangisidir?","Ocak",["Şubat","Mart","Aralık"]],
    ["Yılın son ayı hangisidir?","Aralık",["Kasım","Ocak","Ekim"]],
    ["Mart'tan sonra hangi ay gelir?","Nisan",["Şubat","Mayıs","Mart"]],
    ["Eylül'den önce hangi ay gelir?","Ağustos",["Ekim","Temmuz","Eylül"]],
    ["Yılda kaç mevsim vardır?","4",["2","3","6"]],
    ["İlkbahar hangi aylardır?","Mart, Nisan, Mayıs",["Haziran, Temmuz, Ağustos","Eylül, Ekim, Kasım","Aralık, Ocak, Şubat"]],
    ["Yaz hangi aylardır?","Haziran, Temmuz, Ağustos",["Mart, Nisan, Mayıs","Eylül, Ekim, Kasım","Aralık, Ocak, Şubat"]],
    ["Sonbahar hangi aylardır?","Eylül, Ekim, Kasım",["Mart, Nisan, Mayıs","Haziran, Temmuz, Ağustos","Aralık, Ocak, Şubat"]],
    ["Kış hangi aylardır?","Aralık, Ocak, Şubat",["Mart, Nisan, Mayıs","Haziran, Temmuz, Ağustos","Eylül, Ekim, Kasım"]],
    ["Hangi mevsimde çiçekler açar?","İlkbahar",["Yaz","Sonbahar","Kış"]],
    ["Hangi mevsimde okullar tatile girer?","Yaz",["İlkbahar","Sonbahar","Kış"]],
    ["Hangi mevsimde yapraklar dökülür?","Sonbahar",["İlkbahar","Yaz","Kış"]],
    ["Hangi mevsimde kar yağar?","Kış",["İlkbahar","Yaz","Sonbahar"]],
    ["Şubat ayı kaç gün çeker?","28 veya 29",["30","31","27"]],
    ["31 gün çeken ay hangisidir?","Ocak",["Şubat","Nisan","Haziran"]],
    ["30 gün çeken ay hangisidir?","Nisan",["Ocak","Mart","Temmuz"]],
    ["Okul hangi ayda başlar?","Eylül",["Haziran","Ağustos","Ekim"]],
    ["Cumartesi ve Pazar ne olarak adlandırılır?","Hafta sonu",["İş günleri","Okul günleri","Tatil haftası"]],
    ["Salı'dan 3 gün sonrası hangi gündür?","Cuma",["Perşembe","Cumartesi","Çarşamba"]],
    ["Cuma'dan 2 gün sonrası hangi gündür?","Pazar",["Cumartesi","Pazartesi","Salı"]],
    ["Çarşamba'dan 1 gün önce hangi gündür?","Salı",["Pazartesi","Perşembe","Cuma"]],
    ["Saat 9:00'da başlayan 2 saatlik ders saat kaçta biter?","11:00",["10:00","12:00","10:30"]],
    ["Saat 14:00'te başlayan 3 saatlik film saat kaçta biter?","17:00",["16:00","18:00","15:00"]],
    ["3 hafta kaç gün eder?","21",["14","18","28"]],
    ["2 yıl kaç ay eder?","24",["12","18","36"]],
    ["Saat 10:30 ile 11:00 arası kaç dakika?","30",["15","45","60"]],
    ["Saat tam 3'ü gösterdiğinde yelkovan nerededir?","12",["3","6","9"]],
    ["Saat tam 6'yı gösterdiğinde yelkovan nerededir?","12",["3","6","9"]],
    ["'Sekizi buçuk' saat kaçtır?","8:30",["8:00","9:00","8:15"]],
    ["'Dörde çeyrek var' saat kaçtır?","3:45",["4:00","3:15","4:15"]],
    ["'Altıyı çeyrek geçiyor' saat kaçtır?","6:15",["6:00","6:30","6:45"]],
    ["Günde kaç yarım saat vardır?","48",["24","36","12"]],
    ["Haftanın 3. günü hangisidir?","Çarşamba",["Salı","Perşembe","Pazartesi"]],
    ["Haftanın 5. günü hangisidir?","Cuma",["Perşembe","Cumartesi","Salı"]],
    ["Ekim'den sonra hangi ay gelir?","Kasım",["Eylül","Aralık","Ekim"]],
    ["Haziran'dan önce hangi ay gelir?","Mayıs",["Nisan","Temmuz","Haziran"]],
    ["Bir yılın yarısı kaç ay eder?","6",["3","4","9"]],
    ["Saat 7:00'den saat 10:00'a kadar kaç saat geçer?","3",["2","4","5"]],
    ["4 hafta kaç gün eder?","28",["21","30","14"]],
    ["Günün yarısı kaç saattir?","12",["6","8","24"]],
    ["Bir dakikanın yarısı kaç saniyedir?","30",["15","45","60"]],
    ["Sabah 6:00 ile öğle 12:00 arası kaç saat?","6",["4","5","8"]],
  ];
  for (const [t,a,w] of timeQs) qs.push(q(S,T,t,a,w));
  return qs.slice(0, 200);
}

function mathTema7() {
  const qs = [], S = 'Matematik', T = 'Tema 7';
  const measQs = [
    ["1 metre kaç santimetre eder?","100",["10","50","1000"]],
    ["1 kilometre kaç metre eder?","1000",["100","500","10000"]],
    ["1 kilogram kaç gram eder?","1000",["100","500","10000"]],
    ["1 litre kaç mililitre eder?","1000",["100","500","10000"]],
    ["Uzunluk ölçmek için hangi birim kullanılır?","Santimetre",["Kilogram","Litre","Derece"]],
    ["Ağırlık ölçmek için hangi birim kullanılır?","Kilogram",["Metre","Litre","Santimetre"]],
    ["Sıvı ölçmek için hangi birim kullanılır?","Litre",["Metre","Kilogram","Gram"]],
    ["50 cm + 50 cm = ?","100 cm",["50 cm","75 cm","150 cm"]],
    ["2 m + 3 m = ?","5 m",["4 m","6 m","7 m"]],
    ["1 m - 25 cm = ?","75 cm",["50 cm","80 cm","25 cm"]],
    ["3 kg + 2 kg = ?","5 kg",["4 kg","6 kg","7 kg"]],
    ["5 kg - 3 kg = ?","2 kg",["1 kg","3 kg","4 kg"]],
    ["2 litre + 3 litre = ?","5 litre",["4 litre","6 litre","7 litre"]],
    ["1 m mi, 90 cm mi daha uzundur?","1 m",["90 cm","Eşittir","Bilinmez"]],
    ["2 kg mı, 1500 g mı daha ağırdır?","2 kg",["1500 g","Eşittir","Bilinmez"]],
    ["1 m mi, 150 cm mi daha kısadır?","1 m",["150 cm","Eşittir","Bilinmez"]],
    ["1 m 20 cm kaç cm'dir?","120",["100","102","12"]],
    ["1 m 35 cm kaç cm'dir?","135",["100","35","13"]],
    ["3 m kaç cm'dir?","300",["30","3000","30"]],
    ["500 cm kaç m'dir?","5",["50","5000","500"]],
    ["4000 g kaç kg'dir?","4",["40","400","0.4"]],
    ["2 km kaç m'dir?","2000",["200","20000","200"]],
    ["150 cm kaç m kaç cm'dir?","1 m 50 cm",["15 m","10 m 50 cm","1 m 5 cm"]],
    ["2500 g kaç kg kaç g'dir?","2 kg 500 g",["25 kg","250 g","2 kg 50 g"]],
    ["Hangisi en uzun: 1 m, 120 cm, 95 cm?","120 cm",["1 m","95 cm","Hepsi eşit"]],
    ["Hangisi en kısa: 50 cm, 1 m, 75 cm?","50 cm",["1 m","75 cm","Hepsi eşit"]],
    ["Odanın uzunluğu 5 m, genişliği 4 m ise çevresi kaç m?","18 m",["16 m","20 m","9 m"]],
    ["Bir ip 10 m. 3 m kesildi. Kalan kaç m?","7 m",["6 m","8 m","4 m"]],
    ["3 ağırlık: 2 kg, 3 kg, 5 kg. Toplam kaç kg?","10 kg",["8 kg","9 kg","11 kg"]],
    ["Bir kova 8 litre alıyor. 3 kova kaç litre?","24 litre",["21 litre","23 litre","25 litre"]],
    ["Babam 180 cm, ben 120 cm. Babam kaç cm uzun?","60",["40","50","80"]],
    ["Bir masa 120 cm, diğeri 95 cm. Birlikte kaç cm?","215",["210","220","205"]],
    ["Bir inç yaklaşık kaç cm'dir?","2,54 cm",["1 cm","10 cm","5 cm"]],
    ["10 mm kaç cm'dir?","1",["0.1","10","100"]],
    ["5 cm kaç mm'dir?","50",["5","500","0.5"]],
  ];
  for (const [t,a,w] of measQs) qs.push(q(S,T,t,a,w));
  for (let len=5; len<=25; len+=5)
    qs.push(q(S,T,`${len} cm kaç mm'dir?`, len*10, [len, len*10+10, len*10-10]));
  for (let kg=2; kg<=8; kg++)
    qs.push(q(S,T,`${kg} kg kaç g'dir?`, kg*1000, [kg*100, kg*1000+100, kg*1000-100]));
  for (let m=2; m<=8; m++)
    qs.push(q(S,T,`${m} m kaç cm'dir?`, m*100, [m*10, m*100+10, m*1000]));
  return qs.slice(0, 200);
}

function mathTema8() {
  const qs = [], S = 'Matematik', T = 'Tema 8';
  const moneyQs = [
    ["Türk parasının adı nedir?","Türk Lirası",["Euro","Dolar","Pound"]],
    ["1 lira kaç kuruş eder?","100",["10","50","1000"]],
    ["5 liranın kaç kuruşu vardır?","500",["50","5","5000"]],
    ["1 lira 50 kuruş kaç kuruştur?","150",["105","1050","15"]],
    ["2 lira 25 kuruş kaç kuruştur?","225",["250","22","2025"]],
    ["10 lira + 5 lira = ?","15 lira",["10 lira","20 lira","25 lira"]],
    ["20 lira - 8 lira = ?","12 lira",["10 lira","14 lira","18 lira"]],
    ["Elanaz 10 lirasıyla 3 liralık dondurma aldı. Kaç lirası kaldı?","7 lira",["5 lira","6 lira","8 lira"]],
    ["Ali 15 lirası var, 9 liralık kalem aldı. Para üstü?","6 lira",["4 lira","5 lira","7 lira"]],
    ["Elma 4 lira, armut 6 lira. İkisi için kaç lira?","10 lira",["8 lira","11 lira","12 lira"]],
    ["Defterin fiyatı 7 lira. 3 defter için kaç lira?","21 lira",["18 lira","24 lira","28 lira"]],
    ["Kalemin fiyatı 3 lira. 50 lirasıyla kaç kalem alınır?","16",["10","15","17"]],
    ["50 lirasından 25 lira harcadı. Kaç lirası kaldı?","25 lira",["20 lira","30 lira","35 lira"]],
    ["Oyuncak 45 lira. 50 lira verildi. Para üstü?","5 lira",["3 lira","4 lira","10 lira"]],
    ["Kitap 18 lira, kalem 7 lira. İkisi için kaç lira?","25 lira",["20 lira","24 lira","30 lira"]],
    ["25 kuruş + 75 kuruş = ?","1 lira",["50 kuruş","75 kuruş","125 kuruş"]],
    ["Haftalık harçlık 20 lira. 4 haftada ne kadar birikir?","80 lira",["60 lira","70 lira","100 lira"]],
    ["Elma 2 lira, portakal 3 lira, muz 4 lira. Toplam?","9 lira",["7 lira","8 lira","10 lira"]],
    ["100 liranın yarısı kaç liradır?","50 lira",["25 lira","40 lira","75 lira"]],
    ["60 liranın üçte biri kaç liradır?","20 lira",["15 lira","30 lira","10 lira"]],
    ["3 arkadaş 90 lirayı eşit paylaştı. Herbiri kaç lira?","30 lira",["20 lira","25 lira","45 lira"]],
    ["Kalemlik 35 lira, kitap 40 lira. Fark kaç lira?","5 lira",["3 lira","7 lira","10 lira"]],
    ["100 lira biriktirdi. 37 lira harcadı. Kaç lirası kaldı?","63 lira",["53 lira","60 lira","67 lira"]],
    ["Ekmek 3 lira, süt 8 lira. Toplam?","11 lira",["9 lira","10 lira","12 lira"]],
    ["Ayşe 20 lira, Ali 15 lira, Ece 25 lira harçlık. Toplam?","60 lira",["50 lira","55 lira","65 lira"]],
    ["2 lira 75 kuruş + 1 lira 25 kuruş = ?","4 lira",["3 lira","3 lira 50 kuruş","5 lira"]],
    ["Bir çocuk 100 lira biriktirdi, 37 lira harcadı. Kalan?","63 lira",["60 lira","65 lira","70 lira"]],
  ];
  for (const [t,a,w] of moneyQs) qs.push(q(S,T,t,a,w));
  for (let coins=2; coins<=10; coins++) {
    qs.push(q(S,T,`${coins} tane 5 liralık madeni para kaç lira eder?`, coins*5, [coins*5+5, coins*5-5, coins*5+10]));
    qs.push(q(S,T,`${coins} tane 10 liralık banknot kaç lira eder?`, coins*10, [coins*10+10, coins*10-10, coins*10+20]));
    qs.push(q(S,T,`${coins} tane 1 liralık madeni para kaç lira eder?`, coins, [coins+1, coins-1, coins+2]));
  }
  for (let price=5; price<=50; price+=5) {
    qs.push(q(S,T,`${price} liralık ürün için 50 lira verildi. Para üstü kaç lira?`, 50-price, [50-price+5, 50-price-5, 50-price+10]));
    qs.push(q(S,T,`${price} liralık ürünü almak için gereken minimum banknot (50 TL)?`, price <= 50 ? '50 lira' : '100 lira', ['10 lira', '100 lira', '200 lira']));
  }
  return qs.slice(0, 200);
}

function mathTema9() {
  const qs = [], S = 'Matematik', T = 'Tema 9';
  // 2 tablosu
  for (let i=1; i<=10; i++) qs.push(q(S,T,`2 × ${i} = ?`, 2*i, [2*i+2, 2*(i+1)+2, 2*i-2].filter(x=>x>0&&x!==2*i)));
  // 3 tablosu
  for (let i=1; i<=10; i++) qs.push(q(S,T,`3 × ${i} = ?`, 3*i, [3*i+3, 3*i+6, 3*i-3].filter(x=>x>0&&x!==3*i)));
  // 4 tablosu
  for (let i=1; i<=10; i++) qs.push(q(S,T,`4 × ${i} = ?`, 4*i, [4*i+4, 4*i+8, 4*i-4].filter(x=>x>0&&x!==4*i)));
  // 5 tablosu
  for (let i=1; i<=10; i++) qs.push(q(S,T,`5 × ${i} = ?`, 5*i, [5*i+5, 5*i+10, 5*i-5].filter(x=>x>0&&x!==5*i)));
  // Tekrarlı toplama
  const repAdd = [
    ["2 + 2 + 2 + 2 = ?","8",["6","10","4"]],
    ["3 + 3 + 3 = ?","9",["6","12","3"]],
    ["4 + 4 + 4 + 4 = ?","16",["12","20","8"]],
    ["5 + 5 + 5 + 5 + 5 = ?","25",["20","30","15"]],
    ["2 + 2 + 2 = ?","6",["4","8","2"]],
    ["3 + 3 + 3 + 3 = ?","12",["9","15","6"]],
    ["5 + 5 + 5 = ?","15",["10","20","5"]],
    ["4 + 4 + 4 = ?","12",["8","16","4"]],
    ["Bir kutuda 5 şeker var. 4 kutuda kaç şeker?","20",["15","25","9"]],
    ["Her masada 3 sandalye var. 6 masada kaç sandalye?","18",["15","21","9"]],
    ["3 kutuda 4'er kalem var. Toplam?","12",["7","10","16"]],
    ["5 sepette 3'er elma var. Toplam?","15",["8","10","20"]],
    ["2'şer tane 6 grup kaç eder?","12",["8","10","14"]],
    ["4'er tane 3 grup kaç eder?","12",["8","11","16"]],
    ["Her arabanın 4 tekeri var. 3 araba için kaç teker?","12",["8","16","7"]],
  ];
  for (const [t,a,w] of repAdd) qs.push(q(S,T,t,a,w));
  // Bölme giriş
  const divQs = [
    ["12 ÷ 3 = ?","4",["3","6","5"]],["20 ÷ 4 = ?","5",["4","6","8"]],
    ["15 ÷ 5 = ?","3",["5","2","4"]],["10 ÷ 2 = ?","5",["4","6","8"]],
    ["8 ÷ 4 = ?","2",["4","3","1"]],["18 ÷ 3 = ?","6",["5","7","9"]],
    ["16 ÷ 2 = ?","8",["6","7","9"]],["20 ÷ 5 = ?","4",["3","5","6"]],
    ["12 elmayı 4 kişiye paylaştırdık. Herbiri kaç aldı?","3",["2","4","6"]],
    ["15 çikolatayı 3 kişiye paylaştırdık. Herbiri kaç alır?","5",["3","6","7"]],
  ];
  for (const [t,a,w] of divQs) qs.push(q(S,T,t,a,w));
  return qs.slice(0, 200);
}

function mathTema10() {
  const qs = [], S = 'Matematik', T = 'Tema 10';
  const wps = [
    ["Çiftçinin 24 ineği ve 18 keçisi var. Toplam kaç hayvan?","42",["38","40","44"]],
    ["Kütüphanede 85 kitap vardı. 37'si ödünç alındı. Kaç kaldı?","48",["45","50","52"]],
    ["Her sırada 4 öğrenci oturuyor. 8 sırada toplam kaç öğrenci?","32",["28","36","40"]],
    ["Şekerin fiyatı 2 lira. 15 şeker almak için kaç lira?","30",["25","35","28"]],
    ["Elanaz sabah 7 km, öğleden sonra 5 km yürüdü. Toplam?","12",["10","11","13"]],
    ["Arabanın 4 tekeri var. 9 arabanın toplam kaç tekeri?","36",["32","38","40"]],
    ["Bahçede 5 ağaç var, her ağaçta 8 elma. Toplam?","40",["35","45","13"]],
    ["Saat 8:00'da okula gittim. 6 saat sonra eve döndüm. Saat kaçta?","14:00",["13:00","15:00","16:00"]],
    ["50 liram vardı. 18 lira, sonra 12 lira harcadım. Kalan?","20",["15","25","30"]],
    ["Bir kutu 12 kalem alıyor. 5 kutu kaç kalem alır?","60",["50","55","65"]],
    ["Elanaz her gün 3 sayfa okursa, bir haftada toplam kaç sayfa?","21",["14","18","24"]],
    ["Mağazada 45 mavi, 35 kırmızı top var. Toplam?","80",["75","85","70"]],
    ["3 arkadaş 90 lira biriktirdi. Ortalama herbiri kaç lira?","30",["25","35","45"]],
    ["Sabah 45, öğleden sonra 55 sayfa okundu. Toplam?","100",["90","95","105"]],
    ["Otobüste 40 yolcu vardı. 15'i indi, 8'i bindi. Kaç yolcu?","33",["31","35","48"]],
    ["Babam 1 m 80 cm, ben 1 m 20 cm. Babam kaç cm uzun?","60",["40","50","80"]],
    ["Ahmet 7 yaşında, Ali ondan 3 yaş büyük. Ali kaç yaşında?","10",["9","11","12"]],
    ["Sınıfta 24 kız, 18 erkek öğrenci var. Kızlar kaç tane fazla?","6",["4","8","12"]],
    ["Bir kümeste 30 tavuk var. Yarısı yumurtladı. Kaçı yumurtlamadı?","15",["10","20","30"]],
    ["Her gün 5 sayfa ödev yapan çocuk 4 haftada kaç sayfa yapar?","140",["120","160","80"]],
    ["5, 10, 15, 20, ... dizisinin 8. sayısı kaçtır?","40",["35","45","30"]],
    ["2, 4, 8, 16, ... her sayı öncekinin kaç katıdır?","2",["3","4","5"]],
    ["3 çocuğun boyları 120, 115, 130 cm. En uzun ile en kısa fark?","15",["10","20","5"]],
    ["Bir ağaçta 60 elma var. 24'ü düştü, 10'u toplandı. Kaç kaldı?","36",["34","38","26"]],
    ["Küçük market 78 lira, büyük market 95 lira. Büyük market kaç lira pahalı?","17",["13","15","20"]],
    ["Elanaz'ın 3 kutusu var, her kutuda 7 bant. Toplam?","21",["14","18","24"]],
    ["72 sayfa kitabın üçte ikisi okundu. Kaç sayfa okundu?","48",["24","36","54"]],
    ["Bir ağırlık terazisinin bir kefesinde 3 kg, diğerinde 5 kg var. Fark?","2 kg",["1 kg","3 kg","4 kg"]],
    ["4 sırada 6'şar öğrenci oturuyor. Toplam kaç öğrenci?","24",["20","28","10"]],
    ["50 lira ile 8 liralık 4 kalem aldım. Kaç lira kaldı?","18",["14","22","32"]],
  ];
  for (const [t,a,w] of wps) qs.push(q(S,T,t,a,w));
  for (let a=2; a<=9; a++)
    for (let b=2; b<=9; b++) {
      if (qs.length >= 200) break;
      qs.push(q(S,T,`${a} × ${b} = ?`, a*b, [a*b+a, a*b-b, a*b+b]));
    }
  return qs.slice(0, 200);
}

// ================================================================
// TÜRKÇE
// ================================================================

function turkceTema(tema) {
  const S = 'Türkçe', T = `Tema ${tema}`;
  const all = {
    1: [
      ["Türk alfabesinde kaç harf vardır?","29",["26","28","30"]],
      ["Hangi harf ünlüdür?","a",["b","c","d"]],
      ["'Elanaz' kelimesinde kaç ünlü harf vardır?","4",["2","3","5"]],
      ["'Kitap' kelimesinde kaç hece vardır?","2",["1","3","4"]],
      ["'Kalemlik' kelimesinde kaç hece vardır?","3",["2","4","5"]],
      ["'Okul' kelimesinde kaç harf vardır?","4",["3","5","6"]],
      ["'Araba' kelimesinde kaç ünlü harf vardır?","3",["1","2","4"]],
      ["'Bahçe' kelimesinde kaç ünsüz harf vardır?","3",["1","2","4"]],
      ["Türk alfabesinin ilk harfi hangisidir?","A",["B","E","Z"]],
      ["Türk alfabesinin son harfi hangisidir?","Z",["Y","X","W"]],
      ["Hangi sesli harftir: b, e, k, m?","e",["b","k","m"]],
      ["Hangi sessiz harftir: a, ı, t, u?","t",["a","ı","u"]],
      ["'Masa' kelimesi kaç harften oluşur?","4",["3","5","6"]],
      ["'Öğretmen' kelimesi kaç harften oluşur?","8",["6","7","9"]],
      ["'Ev' kelimesinde kaç harf vardır?","2",["1","3","4"]],
      ["'Güneş' kelimesinde kaç hece vardır?","2",["1","3","4"]],
      ["'Çiçek' kelimesinde kaç hece vardır?","2",["1","3","4"]],
      ["'Patates' kelimesinde kaç hece vardır?","3",["2","4","5"]],
      ["'Kelebek' kelimesinde kaç hece vardır?","3",["2","4","5"]],
      ["'Bilgisayar' kelimesinde kaç hece vardır?","4",["3","5","6"]],
      ["Ünlü harfler kaç tanedir?","8",["5","6","10"]],
      ["Aşağıdakilerden hangisi ünlü harftir?","ü",["f","g","h"]],
      ["Aşağıdakilerden hangisi ünlü harftir?","ı",["j","k","l"]],
      ["'Çanta' kelimesinin ilk harfi nedir?","Ç",["Ş","C","T"]],
      ["'Ördek' kelimesinin son harfi nedir?","k",["e","r","d"]],
      ["Alfabede 'D' harfinden önce hangi harf gelir?","C",["B","E","F"]],
      ["Alfabede 'K' harfinden sonra hangi harf gelir?","L",["J","M","N"]],
      ["'Saat' kelimesinde kaç tane 'a' harfi vardır?","2",["1","3","0"]],
      ["'Muz' kelimesi kaç harften oluşur?","3",["2","4","5"]],
      ["'Elma' kelimesini heceleyelim. Kaç hece?","2",["1","3","4"]],
      ["Büyük harf nerede kullanılır?","Cümle başında",["Cümle ortasında","Cümle sonunda","Her yerde"]],
      ["Cümle hangi noktalama ile biter?","Nokta",["Virgül","Soru işareti","Tire"]],
      ["Soru cümlesi hangi noktalama ile biter?","Soru işareti",["Nokta","Ünlem","Virgül"]],
      ["Seslenme cümlesi hangi noktalama ile biter?","Ünlem işareti",["Nokta","Virgül","Soru işareti"]],
      ["'Ekmek' kelimesinde kaç hece vardır?","2",["1","3","4"]],
      ["'Semaver' kelimesinde kaç hece vardır?","3",["2","4","5"]],
      ["'Uçak' kelimesinde kaç hece vardır?","2",["1","3","4"]],
      ["Türkçede kalın ünlüler hangileridir?","a, ı, o, u",["e, i, ö, ü","a, e, i, ı","o, ö, u, ü"]],
      ["Türkçede ince ünlüler hangileridir?","e, i, ö, ü",["a, ı, o, u","a, e, i, ı","o, ö, u, ü"]],
      ["'Karpuz' kelimesinde kaç hece vardır?","2",["1","3","4"]],
    ],
    2: [
      ["'Büyük' kelimesinin zıt anlamlısı nedir?","Küçük",["Uzun","Kısa","Ağır"]],
      ["'Sıcak' kelimesinin zıt anlamlısı nedir?","Soğuk",["Serin","Nemli","Islak"]],
      ["'Hızlı' kelimesinin zıt anlamlısı nedir?","Yavaş",["Ağır","Hafif","Sessiz"]],
      ["'Güzel' kelimesinin zıt anlamlısı nedir?","Çirkin",["Sıradan","Kötü","Kirli"]],
      ["'Açık' kelimesinin zıt anlamlısı nedir?","Kapalı",["Dolu","Boş","Kırık"]],
      ["'Temiz' kelimesinin zıt anlamlısı nedir?","Kirli",["Pis","Kaba","Bozuk"]],
      ["'İnce' kelimesinin zıt anlamlısı nedir?","Kalın",["Kısa","Geniş","Dolu"]],
      ["'Uzun' kelimesinin zıt anlamlısı nedir?","Kısa",["Küçük","Dar","İnce"]],
      ["'Ağır' kelimesinin zıt anlamlısı nedir?","Hafif",["İnce","Dar","Küçük"]],
      ["'Gece' kelimesinin zıt anlamlısı nedir?","Gündüz",["Sabah","Öğle","Akşam"]],
      ["'Mutlu' kelimesinin zıt anlamlısı nedir?","Mutsuz",["Üzgün","Sinirli","Endişeli"]],
      ["'Yeni' kelimesinin zıt anlamlısı nedir?","Eski",["Kullanılmış","Bozuk","Paslı"]],
      ["'Dolu' kelimesinin zıt anlamlısı nedir?","Boş",["Az","Yarı","Eksik"]],
      ["'Sert' kelimesinin zıt anlamlısı nedir?","Yumuşak",["Körpe","İnce","Hafif"]],
      ["'Zengin' kelimesinin zıt anlamlısı nedir?","Fakir",["Yoksul","Mutsuz","Zayıf"]],
      ["'Masa' kelimesinin eş anlamlısı nedir?","Sofra",["Sandalye","Sehpa","Dolap"]],
      ["'Ülke' kelimesinin eş anlamlısı nedir?","Memleket",["Şehir","Köy","Semt"]],
      ["'Güzel' kelimesinin eş anlamlısı nedir?","Hoş",["Süslü","Parlak","Renkli"]],
      ["'Hızlı' kelimesinin eş anlamlısı nedir?","Süratli",["Güçlü","Enerjik","Canlı"]],
      ["'Yardım' kelimesinin eş anlamlısı nedir?","Destek",["Katkı","İlgi","Sevgi"]],
      ["'Ev' kelimesiyle aynı anlamda kullanılabilecek kelime?","Konut",["İşyeri","Mağaza","Okul"]],
      ["'Mutluluk' kelimesinin eş anlamlısı nedir?","Sevinç",["Huzur","Neşe","Coşku"]],
      ["'Cevap' kelimesinin eş anlamlısı nedir?","Yanıt",["Soru","İstek","Talep"]],
      ["'Başlamak' kelimesinin zıt anlamlısı nedir?","Bitirmek",["Durdurmak","Yavaşlatmak","Beklemek"]],
      ["'Yüksek' kelimesinin zıt anlamlısı nedir?","Alçak",["Düşük","Kısa","İnce"]],
      ["'Derin' kelimesinin zıt anlamlısı nedir?","Sığ",["Az","Düzlük","Kısa"]],
      ["'Çalışkan' kelimesinin zıt anlamlısı nedir?","Tembel",["Uyuşuk","Haylaz","Sakin"]],
      ["'İleri' kelimesinin zıt anlamlısı nedir?","Geri",["Aşağı","Yan","Ters"]],
      ["'Giriş' kelimesinin zıt anlamlısı nedir?","Çıkış",["Kapı","Geçiş","Açılış"]],
      ["'Alçak' kelimesinin zıt anlamlısı nedir?","Yüksek",["Dik","Uzun","İri"]],
    ],
    3: [
      ["Cümlenin başına ne gelir?","Büyük harf",["Küçük harf","Nokta","Virgül"]],
      ["Aşağıdaki cümlelerin hangisi doğru yazılmıştır?","Elanaz okula gitti.","elanaz okula gitti.","Elanaz okula gitti","elanaz Okula gitti."],
      ["Soru cümlesinin sonuna ne gelir?","Soru işareti (?)","Nokta (.)","Ünlem (!)","Virgül (,)"],
      ["'Elanaz okula ___.' Boşluğa ne gelmelidir?","gitti",["gider","gitmek","gitmeli"]],
      ["Aşağıdakilerden hangisi bir isimdir?","Kalem",["Koşmak","Güzel","Hızlı"]],
      ["Aşağıdakilerden hangisi bir eylemdir?","Koşmak",["Masa","Büyük","Hızlı"]],
      ["Aşağıdakilerden hangisi bir sıfat (niteleme sözü)?","Güzel",["Araba","Koşmak","Ev"]],
      ["'Ali ___ oynuyor.' Boşluğa ne gelmelidir?","top",["koşarak","güzel","yavaş"]],
      ["Hangi cümle soru cümlesidir?","Nereye gidiyorsun?",["Okula gidiyorum.","Güzel bir gün!","Koş!"]],
      ["Hangi cümle emir cümlesidir?","Sessiz ol!",["Kitap okuyorum.","Okula gidiyor musun?","Hava güzel."]],
      ["'Annem bana _____ aldı.' Boşluğa hangi kelime uygundur?","çikolata",["uyumak","hızlı","büyük"]],
      ["'Kedi masanın ___ yatıyor.' Boşluğa ne gelmelidir?","üstünde",["koşarak","güzel","hızlı"]],
      ["Aşağıdaki cümlelerin hangisi anlamlıdır?","Çocuklar bahçede oynuyor.",["Bahçede oynuyor çocuklar hızlı.","Oynuyor bahçede.","Çocuklar hızlı bahçede."]],
      ["Bir cümlede en az ne bulunmalıdır?","Özne ve yüklem",["Nesne","Zarf","Sıfat"]],
      ["Cümlenin yüklemi genellikle nerede olur?","Sonda",["Başta","Ortada","Her yerde"]],
      ["'Elanaz _____ gidiyor.' Boşluğa ne gelir?","okula",["güzel","koşmak","hızlı"]],
      ["'Sarı' kelimesi ne tür bir sözcüktür?","Renk sıfatı",["İsim","Eylem","Bağlaç"]],
      ["'Ben, sen, o' hangi sözcük grubuna aittir?","Zamir",["İsim","Sıfat","Eylem"]],
      ["'Çünkü' hangi görev sözcüğüdür?","Bağlaç",["Zamir","Sıfat","Eylem"]],
      ["Özne cümlenin neyi ifade eder?","Kimin/neyin yaptığını",["Ne yapıldığını","Nereye gidildiğini","Ne zaman yapıldığını"]],
      ["'Hızlı arabalar yolda gidiyordu.' cümlesinde özne nedir?","Arabalar",["Hızlı","Yolda","Gidiyordu"]],
      ["'Çiçekler açtı.' cümlesinde yüklem nedir?","Açtı",["Çiçekler","Güzel","Bahçede"]],
      ["'Sarı kedi uyuyor.' cümlesinde sıfat hangisidir?","Sarı",["Kedi","Uyuyor","Var"]],
      ["'Ali parkta koştu.' cümlesinde zarf nerede ifade edilmektedir?","Parkta",["Ali","Koştu","Bir"]],
      ["Ünlem işareti (!) ne zaman kullanılır?","Heyecan veya seslenme cümlelerinde",["Soru sormada","Her cümlenin sonunda","Virgül yerine"]],
    ],
    4: [
      ["Özel isimler büyük harfle mi küçük harfle mi yazılır?","Büyük harfle",["Küçük harfle","Sadece bazen büyük","Farketmez"]],
      ["'İstanbul' kelimesi neden büyük harfle yazılır?","Özel isim olduğu için",["Uzun kelime olduğu için","Yabancı kelime olduğu için","Güzel olduğu için"]],
      ["Hangi kelime yanlış yazılmıştır?","istanbul",["İstanbul","Ankara","Türkiye"]],
      ["Virgül (,) nerede kullanılır?","Sayma sıralamasında",["Cümle sonunda","Soru cümlelerinde","Ünlem cümlelerinde"]],
      ["Hangi cümle doğru noktalanmıştır?","Elma, armut ve muz aldım.",["Elma armut ve muz aldım.","Elma. armut. ve muz aldım.","Elma, armut, ve muz, aldım."]],
      ["'Elanaz' ismi hangi harfle başlamalıdır?","E (büyük)",["e (küçük)","E veya e","Fark etmez"]],
      ["Ay isimleri büyük harfle mi yazılır?","Hayır, küçük harfle",["Evet, büyük harfle","Sadece bazen","Fark etmez"]],
      ["Hangi örnek doğru yazımdır?","pazartesi",["Pazartesi","PAZARTESİ","pAZArteSi"]],
      ["Cümle başında ne kullanılır?","Büyük harf",["Küçük harf","Nokta","Virgül"]],
      ["İki nokta (:) ne zaman kullanılır?","Açıklama yaparken",["Cümle sonunda","Soru sormada","Her cümle sonunda"]],
      ["'g' harfinin büyüğü nedir?","G",["Ğ","C","K"]],
      ["'ş' harfinin büyüğü nedir?","Ş",["S","Z","Ç"]],
      ["'ı' harfinin büyüğü nedir?","I",["İ","Î","Y"]],
      ["'i' harfinin büyüğü nedir?","İ",["I","Î","Y"]],
      ["Tırnak işareti (\"\") ne zaman kullanılır?","Alıntı yaparken",["Soru sormada","Sayarken","Her cümle sonunda"]],
      ["Hangi cümle doğru yazılmıştır?","Ali okula gitti.","ali okula gitti.","Ali Okula gitti.","ali Okula Gitti."],
      ["Cümlenin anlamlı olması için en az kaç kelime olmalıdır?","İki",["Bir","Üç","Dört"]],
      ["'Su içtim.' cümlesinde kaç kelime vardır?","3",["2","4","5"]],
      ["Hangi kelimeler özel isimdir?","Ayşe, Ankara",["elma, araba","büyük, küçük","koşmak, yemek"]],
      ["Türkçede ek almış kelimelerde büyük-küçük harf uyumu hangi kuraldır?","Ses uyumu",["Hece uyumu","Anlam uyumu","Yazım uyumu"]],
    ],
    5: [
      ["Nokta (.) hangi cümlelerin sonuna gelir?","Bildirme cümleleri",["Soru cümleleri","Ünlem cümleleri","Emir cümleleri"]],
      ["Soru işareti (?) hangi cümlelerin sonuna gelir?","Soru cümleleri",["Bildirme cümleleri","Ünlem cümleleri","Emir cümleleri"]],
      ["Ünlem işareti (!) hangi cümlelerin sonuna gelir?","Ünlem ve emir cümleleri",["Soru cümleleri","Bildirme cümleleri","Haber cümleleri"]],
      ["Virgül (,) hangi durumda kullanılır?","Sayma sıralamasında",["Cümle sonunda","Soru cümlelerinde","Ünlem cümlelerinde"]],
      ["'Selam nasılsın?' cümlesine hangi işaret eklenmelidir?","Soru işareti (?)",["Nokta (.)","Ünlem (!)","Virgül (,)"]],
      ["'Koş!' cümlesine hangi işaret eklenmiştir?","Ünlem işareti (!)",["Nokta","Soru işareti","Virgül"]],
      ["'Bugün hava güzel.' cümlesinde hangi noktalama işareti vardır?","Nokta",["Virgül","Soru işareti","Ünlem"]],
      ["Hangi cümle doğru noktalanmıştır?","Merhaba, nasılsın?","Merhaba nasılsın.","Merhaba, nasılsın!","merhaba nasılsın?"],
      ["İki nokta üst üste (:) ne zaman kullanılır?","Açıklama veya liste başında",["Her cümle sonunda","Soru sormada","Ünlem durumunda"]],
      ["Kesme işareti (') ne zaman kullanılır?","Özel isimlere ek geldiğinde",["Her isimde","Sayılarda","Renklerde"]],
      ["'Türkiye'nin başkenti Ankara'dır.' cümlesinde kaç noktalama işareti var?","2 (kesme işareti)",["0","1","3"]],
      ["Hangi cümle doğru noktalanmıştır?","Elma, armut, muz.","Elma armut muz.","Elma armut, muz.","Elma. armut. muz."],
      ["'Dur!' cümlesinin sonundaki işaret nedir?","Ünlem",["Nokta","Soru işareti","Virgül"]],
      ["'Bu kitabı okuyor musun?' cümlesinin sonundaki işaret?","Soru işareti",["Nokta","Ünlem","Virgül"]],
      ["Paragraf her zaman ne ile başlar?","Büyük harf",["Küçük harf","Rakam","Virgül"]],
      ["'Vay canına!' cümlesinde hangi duygu ifade edilmiştir?","Şaşırma",["Üzülme","Soru sorma","Anlatma"]],
      ["'Ne güzel bir gün!' cümlesinde hangi duygu var?","Sevinç",["Üzüntü","Soru","Emir"]],
      ["Hangi kelimeler arasına virgül konur?","Sıralanan kelimeler arasına",["Bütün kelimeler arasına","Cümle sonuna","Paragraf başına"]],
      ["Konuşma çizgisi (-) ne zaman kullanılır?","Diyaloglarda",["Soru sormada","Anlatımlarda","Her cümle sonunda"]],
      ["Hangi işaret bir duygu veya seslenmeyi vurgular?","Ünlem (!)",["Nokta","Virgül","Kesme"]],
    ],
    6: [
      ["'Aslan' hangi sözcük grubuna aittir?","Hayvan ismi",["Nesne ismi","Eylem","Sıfat"]],
      ["'Koşmak' hangi sözcük grubuna aittir?","Eylem",["İsim","Sıfat","Bağlaç"]],
      ["'Mavi' hangi sözcük grubuna aittir?","Renk sıfatı",["İsim","Eylem","Zamir"]],
      ["'Ama' hangi görev sözcüğüdür?","Bağlaç",["Zamir","Sıfat","Eylem"]],
      ["Gece gündüz olan şeye ne denir?","Her zaman",["Bazen","Nadiren","Hiçbir zaman"]],
      ["Güzel ile aynı anlama gelen kelime hangisidir?","Hoş",["Çirkin","Uzun","Kötü"]],
      ["'Gözlemek' kelimesi ne anlama gelir?","Dikkatle bakmak",["Hızlı koşmak","Kuvvetli olmak","Uyumak"]],
      ["'Nazik' kelimesi ne anlama gelir?","Kibar",["Hırçın","Sert","Kaba"]],
      ["'Sabırlı' kelimesi ne anlama gelir?","Sakin bekleyen",["Aceleci","Sinirli","Çabuk"]],
      ["'Cesur' kelimesi ne anlama gelir?","Korkusuz",["Korkak","Üzgün","Hevesli"]],
      ["'Meraklı' kelimesi ne anlama gelir?","Her şeyi öğrenmek isteyen",["Tembel","Çalışkan","Sabırlı"]],
      ["'Cömert' kelimesi ne anlama gelir?","Eli açık, paylaşan",["Cimri","Bencil","Titiz"]],
      ["'Şaşırmak' kelimesi ne anlama gelir?","Beklenmedik şeyle karşılaşmak",["Sevinmek","Üzülmek","Korkmak"]],
      ["'Yorgun' kelimesi ne anlama gelir?","Bitkin","Dinç","Enerjik","Hevesli"],
      ["'Heyecan' kelimesi ne anlama gelir?","Coşku",["Üzüntü","Sıkıntı","Korku"]],
      ["'Tembellik' kelimesi ne anlama gelir?","Çalışmaktan kaçınma",["Çalışkanlık","Titizlik","Merak"]],
      ["'Sorumluluk' kelimesi ne anlama gelir?","Üstlenen görevi yerine getirme",["Kaçmak","İlgisiz olmak","Uyumak"]],
      ["'Alçakgönüllü' kelimesi ne anlama gelir?","Mütevazı",["Kibirli","Gururlu","Övünen"]],
      ["'Vatan' kelimesi ne anlama gelir?","Doğup büyüdüğümüz ülke",["Şehir","Sokak","Okul"]],
      ["'Arkadaşlık' kelimesinin içinde hangi isim var?","Arkadaş",["Taş","Lık","Dış"]],
    ],
    7: [
      ["Şiirde satırlara ne denir?","Dize",["Paragraf","Cümle","Dörtlük"]],
      ["4 dizeden oluşan şiir bölümüne ne denir?","Dörtlük",["Dize","Paragraf","Bölüm"]],
      ["Masal genellikle nasıl başlar?","Bir varmış bir yokmuş...",["Günün birinde...","Sabah uyandım...","Siz de bu işi yapın..."]],
      ["Masallarda kahramanlar genellikle hangi özelliği taşır?","İyiler ödüllendirilir",["Kötüler kazanır","Her şey gerçektir","Hep üzücü biter"]],
      ["Masallar gerçek mi, hayal mi?","Hayal ürünü",["Gerçek","Kısmen gerçek","Tarihsel"]],
      ["Fabl nedir?","Hayvanların konuştuğu öğütlü hikâye",["Gerçek hayat hikâyesi","Şiir türü","Haber yazısı"]],
      ["Şiirde aynı seslerin tekrarlanmasına ne denir?","Uyak (Kafiye)",["Dize","Dörtlük","Bölüm"]],
      ["'Kırmızı bir gül / Bahçede güzel' - bu iki dize nasıl uyumluluk gösterir?","Kafiyeli (gül-güzel)",["Kafiyesiz","Asonans","Aliterasyon"]],
      ["'Çocuk Masalı' adlı metin türü nedir?","Masal",["Şiir","Hikâye","Fıkra"]],
      ["Masallarda sihirli varlıklar olur mu?","Evet",["Hayır","Bazen","Hiçbir zaman"]],
      ["Fıkranın özelliği nedir?","Güldürücü, esprili kısa metin",["Uzun ve üzücü","Gerçek haberi anlatan","Bilimsel metin"]],
      ["Nasrettin Hoca hikayeleri hangi türde değerlendirilebilir?","Fıkra",["Roman","Şiir","Masal"]],
      ["Tekerlemeler ne için kullanılır?","Eğlenmek ve dil becerisi için",["Ders çalışmak için","Bilgi edinmek için","Haberleri okumak için"]],
      ["Şiirde ritim ne demektir?","Ölçülü ses ve vurgu akışı",["Sadece uyak","Anlam","Konu"]],
      ["'Al elmayı ver elmayı' - bu tekerlemenin özelliği nedir?","Ses tekrarı ve ritim",["Bilgi vermesi","Uzun olması","Konusunun olması"]],
      ["Masal ile hikâye arasındaki fark nedir?","Masalda hayal unsurları vardır",["Masallar kısadır","Hikâyeler hayaldir","İkisi aynıdır"]],
      ["Ninniler ne zaman söylenir?","Bebekleri uyutmak için",["Oyun oynarken","Okurken","Yemek yerken"]],
      ["Maniler nasıl bir şiir türüdür?","Dört dizelik halk şiiri",["Uzun şiir","Nesir","Fabl"]],
      ["Destanlar neleri anlatır?","Büyük kahramanlıkları",["Günlük yaşamı","Çocuk oyunlarını","Yemek tariflerini"]],
      ["'Kaplumbağa ve Tavşan' hangi tür metin?","Fabl",["Şiir","Roman","Günlük"]],
    ],
    8: [
      ["Bir metni okuyup anlamak için ne yapılmalıdır?","Dikkatli okunmalı",["Hızlı geçilmeli","Atlama yapılmalı","Sadece son cümle okunmalı"]],
      ["Ana fikir nedir?","Yazarın okuyucuya vermek istediği temel mesaj",["İlk cümle","Son cümle","En uzun cümle"]],
      ["Yardımcı fikir nedir?","Ana fikri destekleyen düşünceler",["Ana fikrin kendisi","Metin başlığı","Yazarın adı"]],
      ["Okuma anlama sorusunda 'neden' sorusu ne arar?","Neden-sonuç ilişkisi",["Yer bilgisi","Kişi bilgisi","Zaman bilgisi"]],
      ["Okuma anlama sorusunda 'nerede' sorusu ne arar?","Yer bilgisi",["Zaman bilgisi","Neden bilgisi","Kişi bilgisi"]],
      ["Okuma anlama sorusunda 'ne zaman' sorusu ne arar?","Zaman bilgisi",["Yer bilgisi","Neden bilgisi","Kişi bilgisi"]],
      ["Paragraf nedir?","Aynı konuyu işleyen cümleler topluluğu",["Tek cümle","Bir kitap","Bir sayfa"]],
      ["Metin başlığı ne işe yarar?","Konuyu özetler",["Sonucu verir","Yazarı tanıtır","Karakterleri listeler"]],
      ["Bir hikâyede 'olay örgüsü' ne demektir?","Olayların sırası",["Kişi listesi","Yer listesi","Sonuç cümlesi"]],
      ["Metinde geçen bilinen bir kelimeye ne denir?","Anlamı bilinen kelime",["Yeni kelime","Zor kelime","Yabancı kelime"]],
      ["Sözlük ne işe yarar?","Kelimelerin anlamını öğretir",["Kelime saydırır","Hece böler","Heceleri öğretir"]],
      ["Metnin sonundaki özet nedir?","Kısa ve genel anlatım",["İlk paragraf","Yazarın adı","Konunun sonu"]],
      ["'Sevdiklerinize zaman ayırın.' bu cümle hangi tür?","Öneri",["Soru","Haber","Tanımlama"]],
      ["Bir haberin en önemli bölümü neresidir?","Başlık ve giriş",["Son paragraf","Ortası","Fotoğraf"]],
      ["Okurken not almak neden yararlıdır?","Hatırlamak için",["Yazmayı öğrenmek için","Kitabı süslemek için","Daha hızlı okumak için"]],
      ["Metin içindeki örnekler ne işe yarar?","Ana fikri açıklar",["Konuyu değiştirir","Metni uzatır","Okuyanı şaşırtır"]],
      ["'Çiçeğin güzelliği baharı müjdeler.' bu cümle ne anlatır?","Çiçek açtığında bahar gelmiştir",["Çiçekler kışın açar","Bahar kıştan önce gelir","Çiçek güzel değildir"]],
      ["Metnin türü nasıl anlaşılır?","Konusuna ve amacına bakarak",["Kaç sayfa olduğuna bakarak","Yazarın adına bakarak","Resminden bakarak"]],
      ["Hikâyede 'çatışma' ne demektir?","Karakterlerin sorunu veya engeli",["Sonuç","Mekân","Zaman"]],
      ["Hangi metin türü gerçek bilgi verir?","Bilgilendirici metin",["Masal","Şiir","Fıkra"]],
    ],
    9: [
      ["İsim ne demektir?","Varlıkların ve kavramların adı",["Eylemlerin adı","Sıfatların adı","Bağlaçların adı"]],
      ["Eylem (fiil) ne demektir?","Yapılan iş, hareket veya oluş",["Varlıkların adı","Niteleme sözleri","Bağlaçlar"]],
      ["Sıfat ne demektir?","İsimleri niteleyen veya belirten sözcük",["Eylemlerin adı","Varlıkların adı","Bağlaçlar"]],
      ["Zamir nedir?","İsim yerine kullanılan sözcük",["Eylem yerine kullanılan","Sıfat yerine kullanılan","Bağlaç"]],
      ["'Ben, sen, o, biz, siz, onlar' hangi sözcük grubuna girer?","Zamir",["İsim","Sıfat","Eylem"]],
      ["'Koşmak, yemek, içmek' hangi sözcük grubuna girer?","Eylem",["İsim","Sıfat","Zamir"]],
      ["'Kırmızı, büyük, güzel' hangi sözcük grubuna girer?","Sıfat",["İsim","Eylem","Zamir"]],
      ["Eril ve dişil ayrımı Türkçede var mıdır?","Hayır",["Evet","Bazen","Sadece özel isimlerde"]],
      ["Türkçede tekil ve çoğul ek hangisidir?","Çoğul: -lar/-ler",["Çoğul: -ın/-in","-da/-de","-la/-le"]],
      ["'Çocuklar oynuyor.' cümlesinde özne nedir?","Çocuklar",["Oynuyor","Güzel","Hızlı"]],
      ["'Arabalar yolda gidiyordu.' cümlesinde yüklem nedir?","Gidiyordu",["Arabalar","Yolda","Hızlı"]],
      ["'Kedi masanın üstünde uyuyor.' cümlesinde nesne nedir?","Yok (nesnesiz cümle)",["Kedi","Masanın","Üstünde"]],
      ["'Dün okula gittim.' cümlesinde zarf nedir?","Dün",["Okula","Gittim","Ben"]],
      ["Türkçede kelimeler genellikle hangi sırayla dizilir?","Özne - Nesne - Yüklem",["Yüklem - Özne - Nesne","Nesne - Yüklem - Özne","Özne - Yüklem - Nesne"]],
      ["Olumlu cümleyi olumsuz yapan ek nedir?","-ma/-me",["-lar/-ler","-da/-de","-ın/-in"]],
      ["'Gitmiyor.' cümlesi olumlu mu, olumsuz mu?","Olumsuz",["Olumlu","Soru","Emir"]],
      ["'Gidecek mi?' cümlesi hangi cümle türüdür?","Soru",["Olumlu","Olumsuz","Emir"]],
      ["Çoğul eki '-lar' hangi seslerin ardından gelir?","Kalın sesli harflerin ardından",["İnce sesli harflerin ardından","Her harfin ardından","Sadece ünsüzlerin ardından"]],
      ["Çoğul eki '-ler' hangi seslerin ardından gelir?","İnce sesli harflerin ardından",["Kalın sesli harflerin ardından","Her harfin ardından","Sadece ünsüzlerin ardından"]],
      ["'Elmalar' kelimesindeki çoğul eki nedir?","-lar",["el","elma","lar"]],
    ],
    10: [
      ["Türkçede sesli uyumu nedir?","Kelimenin eklerindeki seslerin uyumu",["Kelimenin uzunluğu","Hece sayısı","Anlam birliği"]],
      ["Hangi cümle en anlamlıdır?","Elanaz bahçede çiçek topladı.",["Topladı Elanaz çiçek.","Bahçede Elanaz.","Çiçek topladı."]],
      ["Aşağıdaki kelimelerden hangisi 3 heceli?","Patates",["Araba","Masa","Ev"]],
      ["Aşağıdaki kelimelerden hangisi 1 heceli?","Kış",["Elma","Okul","Ördek"]],
      ["'Gelmek' fiilinin olumsuz hali nedir?","Gelmemek",["Gelemek","Geldik","Gelme"]],
      ["'Araba' kelimesinin çoğulu nedir?","Arabalar",["Arabalı","Arabanın","Arabaya"]],
      ["'Kitap' kelimesinin çoğulu nedir?","Kitaplar",["Kitaplı","Kitabın","Kitapça"]],
      ["Türkçede cümle hangi sözcükle biter?","Yüklemle",["Özneyle","Nesneyle","Zarfla"]],
      ["'Bugün hava güzel mi?' sorusunun cevabı ne olabilir?","Evet, hava güzel.",["Bugün.","Hava.","Güzel."]],
      ["Hangi kelime diğerlerinden farklıdır?","Koşmak",["Elma","Masa","Kalem"]],
      ["Hangi kelime diğerlerinden farklıdır?","Güzel",["Koşmak","Yemek","Gitmek"]],
      ["Hangi kelime diğerlerinden farklıdır?","Sinirli",["Kırmızı","Mavi","Sarı"]],
      ["'Yağmur yağıyor.' cümlesinde özne nedir?","Yağmur",["Yağıyor","Dışarıda","Bugün"]],
      ["'Elanaz resim yaptı.' cümlesinde yüklem nedir?","Yaptı",["Elanaz","Resim","Güzel"]],
      ["Hangi kelime 'zaman' ifade eder?","Dün",["Güzel","Büyük","Mavi"]],
      ["Hangi kelime 'yer' ifade eder?","Orada",["Güzel","Büyük","Hızlı"]],
      ["Hangi kelime 'nasıl' sorusunu cevaplar?","Hızlıca",["Okul","Araba","Elma"]],
      ["Türkçede kelimeler genellikle soldan mı, sağdan mı yazılır?","Soldan sağa",["Sağdan sola","Yukarıdan aşağıya","Aşağıdan yukarıya"]],
      ["Anlatım bozukluğu nedir?","Yanlış anlaşılan ya da çelişkili cümle",["Kısa cümle","Uzun cümle","Soru cümlesi"]],
      ["'Ekmek ile su aldım.' cümlesinde bağlaç hangisidir?","ile",["Ekmek","Su","Aldım"]],
    ],
  };
  const pool = all[tema] || all[1];
  return pool.map(([t,a,...w]) => {
    const wrongs = (w.length === 1 && Array.isArray(w[0])) ? w[0] : w;
    return q(S,T,t,a,wrongs);
  }).slice(0, 100);
}

// ================================================================
// FEN BİLİMLERİ
// ================================================================

function fenTema(tema) {
  const S = 'Fen Bilimleri', T = `Tema ${tema}`;
  const all = {
    1: [
      ["Canlıların ortak özelliği nedir?","Büyür, ürer, beslenirler",["Sadece hareket ederler","Sadece nefes alırlar","Renkleri vardır"]],
      ["Bitkiler canlı mıdır?","Evet",["Hayır","Bazen","Yalnızca büyükler"]],
      ["Hayvanlar canlı mıdır?","Evet",["Hayır","Bazen","Küçükler hariç"]],
      ["Taşlar canlı mıdır?","Hayır",["Evet","Bazen","Bazı taşlar canlıdır"]],
      ["Canlılar nefes alır mı?","Evet",["Hayır","Sadece büyükler","Yalnızca hayvanlar"]],
      ["Bitkiler büyür mü?","Evet",["Hayır","Sadece çiçekler","Yalnızca ağaçlar"]],
      ["Canlılar nasıl beslenirler?","Besin alarak",["Su içerek","Uyuyarak","Güneşte durarak"]],
      ["İnsanlar hangi hücre ile ürer?","Sperm ve yumurta hücresi",["Sinir hücresi","Kan hücresi","Kemik hücresi"]],
      ["Hangi yapı hem canlılarda hem de cansızlarda bulunabilir?","Su",["Hücre","Genetik bilgi","Sinir"]],
      ["Canlılar çevresine uyum sağlar mı?","Evet",["Hayır","Sadece büyük canlılar","Sadece hayvanlar"]],
      ["Mikroskopla görülebilen canlılara ne denir?","Mikroorganizma",["Virüs","Atom","Hücre duvarı"]],
      ["Hücre nedir?","Canlıların temel yapı birimi",["Besin birimi","Nefes organı","Hareket organı"]],
      ["Canlılar nasıl çoğalır?","Ürerek",["Büyüyerek","Hareket ederek","Yiyerek"]],
      ["Hangi varlık cansızdır?","Taş",["Ağaç","Kedi","Mantar"]],
      ["Hangi varlık canlıdır?","Mantar",["Taş","Cam","Demir"]],
      ["Canlıların ortak özelliğini en iyi ifade eden hangisidir?","Doğar, büyür, ürer, ölür",["Hareket eder","Su içer","Renk değiştirir"]],
      ["Bitkiler neye ihtiyaç duyar?","Işık, su ve toprak",["Sadece su","Sadece ışık","Sadece toprak"]],
      ["Hayvanlar neye ihtiyaç duyar?","Besin ve su",["Sadece besin","Sadece su","Sadece hava"]],
      ["Canlılar hangi ortamda yaşar?","Kara, su ve hava",["Sadece karada","Sadece suda","Sadece havada"]],
      ["Mantarlar canlı mıdır?","Evet",["Hayır","Bazen","Sadece büyük mantarlar"]],
    ],
    2: [
      ["Bitkilerin hangi organı fotosentez yapar?","Yaprak",["Kök","Gövde","Çiçek"]],
      ["Bitkinin toprağa tutunan organı nedir?","Kök",["Gövde","Yaprak","Çiçek"]],
      ["Bitkinin besin ve su taşıyan organı nedir?","Gövde",["Kök","Yaprak","Meyve"]],
      ["Bitkinin çoğalma organı nedir?","Çiçek",["Kök","Gövde","Yaprak"]],
      ["Bitkinin tohumunu taşıyan organı nedir?","Meyve",["Çiçek","Gövde","Kök"]],
      ["Fotosentez için hangi enerji kullanılır?","Güneş ışığı",["Rüzgar","Su","Toprak"]],
      ["Fotosentezde ne üretilir?","Besin (şeker) ve oksijen",["Karbondioksit","Su","Toprak"]],
      ["Bitkiler karbondioksiti ne için alır?","Fotosentez için",["Nefes için","Büyümek için","Çiçek açmak için"]],
      ["Kaktüs hangi ortamda yaşar?","Çölde",["Denizde","Ormanda","Kutuplarda"]],
      ["Su altında yaşayan bitkilere ne denir?","Su bitkileri",["Kara bitkileri","Çöl bitkileri","Tundra bitkileri"]],
      ["Tohumlar nasıl yayılır?","Rüzgar, su, hayvanlar ile",["Sadece rüzgarla","Sadece suyla","Yayılmaz"]],
      ["Hangi bitkinin yaprağı yoktur?","Kaktüs",["Gül","Lale","Papatya"]],
      ["Çam ağacı yapraklarını döker mi?","Hayır, yıl boyunca yeşil kalır",["Evet, sonbaharda","Evet, yazın","Evet, kışın"]],
      ["Buğday tohumu olmadan yetişebilir mi?","Hayır",["Evet","Bazen","Büyük buğdaylar yetişebilir"]],
      ["Hangi organ bitkiye destek olup onu dik tutar?","Gövde",["Kök","Yaprak","Çiçek"]],
      ["Çiçek açmayan bitkiler nasıl çoğalır?","Sporla",["Tohumla","Meyveyle","Çiçekle"]],
      ["Güneş ışığı olmadan bitki yaşayabilir mi?","Hayır",["Evet","Kısa süre","Bazen"]],
      ["Su olmadan bitki yaşayabilir mi?","Hayır",["Evet","Bazen","Büyük bitkiler yaşar"]],
      ["Meyvenin içinde ne bulunur?","Tohum",["Kök","Gövde","Çiçek"]],
      ["Hangi bitki en uzun ağaçtır?","Sekoya ağacı",["Çam","Meşe","Gül"]],
    ],
    3: [
      ["Hangi hayvan memeliler grubuna girer?","Kedi",["Kelebek","Balık","Kertenkele"]],
      ["Hangi hayvan kuşlar grubuna girer?","Güvercin",["Köpek","Kertenkele","Kurbağa"]],
      ["Hangi hayvan sürüngenler grubuna girer?","Kertenkele",["Kedi","Güvercin","Kurbağa"]],
      ["Hangi hayvan balıklar grubuna girer?","Somon",["Kedi","Güvercin","Kertenkele"]],
      ["Hangi hayvan omurgasızdır?","Kelebek",["Kedi","Güvercin","Balık"]],
      ["Hangi hayvan yumurtayla çoğalır?","Tavuk",["Köpek","Kedi","İnek"]],
      ["Hangi hayvan yavrularını sütle besler?","İnek",["Tavuk","Kurbağa","Somon"]],
      ["Hangi hayvan hem karada hem suda yaşar?","Kurbağa",["Kedi","Tavuk","Geyik"]],
      ["Kuşların vücudu neyle kaplıdır?","Tüy",["Kıl","Pul","Kabuk"]],
      ["Balıkların vücudu neyle kaplıdır?","Pul",["Tüy","Kıl","Kabuk"]],
      ["Sürüngenlerin vücudu neyle kaplıdır?","Pul veya kabuk",["Tüy","Kıl","Deri"]],
      ["Memelilerin vücudu neyle kaplıdır?","Kıl veya tüy",["Pul","Kabuk","Tüy"]],
      ["Hangi hayvan kutup bölgesinde yaşar?","Penguen",["Aslan","Deve","Timsah"]],
      ["Hangi hayvan çölde yaşar?","Deve",["Penguen","Kutup ayısı","Salmon"]],
      ["Hangi hayvan en büyük karasal hayvandır?","Fil",["Aslan","Gergedan","Zürafa"]],
      ["Hangi hayvan en uzun boylu karasal hayvandır?","Zürafa",["Fil","Aslan","Deve"]],
      ["Çekirge hangi gruba girer?","Böcek",["Memeli","Kuş","Balık"]],
      ["Arı bal yapar mı?","Evet",["Hayır","Bazen","Sadece büyük arılar"]],
      ["Hangi hayvan kış uykusuna yatar?","Ayı",["Kedi","At","Köpek"]],
      ["Hangi hayvan göç eder?","Leylek",["Kedi","At","Köpek"]],
    ],
    4: [
      ["Maddenin üç hali nedir?","Katı, sıvı, gaz",["Büyük, orta, küçük","Sert, yumuşak, sıvı","Ağır, orta, hafif"]],
      ["Buzun hali nedir?","Katı",["Sıvı","Gaz","Plazma"]],
      ["Suyun hali nedir?","Sıvı",["Katı","Gaz","Plazma"]],
      ["Havanın hali nedir?","Gaz",["Katı","Sıvı","Plazma"]],
      ["Su ısıtıldığında ne olur?","Sıvıdan gaz hale geçer (buharlaşır)",["Katı olur","Renklenir","Büyür"]],
      ["Su soğutulduğunda ne olur?","Katı hale geçer (donar)",["Gaz olur","Renklenir","Küçülür"]],
      ["Buz eridiğinde ne olur?","Sıvı hale geçer",["Gaz olur","Renklenir","Yok olur"]],
      ["Hangi madde katı halden sıvı hale geçebilir?","Buz",["Hava","Duman","Mürekkep"]],
      ["Sıvılar şekil alır mı?","Evet, kabın şeklini alır",["Hayır, kendi şeklini korur","Bazen","Sadece su"]],
      ["Katılar şekil alır mı?","Hayır, kendi şeklini korur",["Evet, kabın şeklini alır","Bazen","Sadece buz"]],
      ["Gazlar hacim kaplar mı?","Evet, her yeri doldurur",["Hayır","Sadece balonlar","Bazen"]],
      ["Hangi madde oda sıcaklığında sıvıdır?","Su",["Buz","Demir","Taş"]],
      ["Hangi madde oda sıcaklığında katıdır?","Tahta",["Su","Hava","Duman"]],
      ["Hava madde midir?","Evet",["Hayır","Bazen","Sadece temiz hava"]],
      ["Oksijen hangi maddedir?","Gaz",["Katı","Sıvı","Plazma"]],
      ["Demir ısıtıldığında ne olur?","Erir, sıvı hale gelir",["Gaz olur","Büyür","Küçülür"]],
      ["Mum yandığında ne olur?","Erir ve gaz çıkar",["Katı kalır","Sadece erir","Sadece gaz çıkar"]],
      ["Sıvılar akabilir mi?","Evet",["Hayır","Sadece su","Bazen"]],
      ["Katılar akabilir mi?","Hayır",["Evet","Bazen","Sadece büyük katılar"]],
      ["Su kaç derecede buharlaşır?","100°C",["0°C","50°C","200°C"]],
    ],
    5: [
      ["Kuvvet nedir?","İtme veya çekme etkisi",["Ağırlık","Sürat","Renk"]],
      ["İtme kuvveti ne yapar?","Nesneyi uzaklaştırır",["Nesneyi çeker","Nesneyi durdurur","Nesneyi küçültür"]],
      ["Çekme kuvveti ne yapar?","Nesneyi yaklaştırır",["Nesneyi uzaklaştırır","Nesneyi büyütür","Nesneyi parçalar"]],
      ["Sürtünme kuvveti ne yapar?","Hareketi yavaşlatır veya durdurur",["Hareketi hızlandırır","Nesneyi büyütür","Nesneyi yükseltir"]],
      ["Yerçekimi nedir?","Dünyanın her şeyi kendine çekme kuvveti",["İnsanın uçma kuvveti","Rüzgar kuvveti","Mıknatıs kuvveti"]],
      ["Ağır mi, hafif mi daha hızlı düşer?","İkisi de aynı hızda düşer (havada farklı olabilir)",["Ağır","Hafif","Renklisi"]],
      ["Mıknatıs hangi maddeleri çeker?","Demir, çelik",["Tahta","Plastik","Cam"]],
      ["Mıknatısın kaç kutbu vardır?","2 (Kuzey ve Güney)",["1","3","4"]],
      ["Aynı kutuplar birbirine nasıl davranır?","İter",["Çeker","Kayıtsızdır","Yapışır"]],
      ["Zıt kutuplar birbirine nasıl davranır?","Çeker",["İter","Kayıtsızdır","Erişemez"]],
      ["Denge ne demektir?","Kuvvetlerin eşit olması",["Hareketin hızlanması","Nesnenin düşmesi","Kuvvetin artması"]],
      ["Kaldıraç neye yarar?","Az kuvvetle büyük yük kaldırmaya",["Hız artırmaya","Işık yakmaya","Su pompalamaya"]],
      ["Tekerlek ne işe yarar?","Hareketi kolaylaştırır",["Ağırlığı artırır","Hava sağlar","Sesi keser"]],
      ["Eğik düzlem ne işe yarar?","Yük çıkarmayı kolaylaştırır",["Ağırlık ekler","Hızı azaltır","Yükü parçalar"]],
      ["Manivela neyle aynıdır?","Kaldıraç",["Eğik düzlem","Dişli","Kasnak"]],
      ["Hangi makina en basit makinedir?","Kaldıraç",["Motor","Bilgisayar","Vinç"]],
      ["Makara ne işe yarar?","İpin yönünü değiştirerek kolaylaştırır",["Ses yükseltir","Işık sağlar","Su pompalar"]],
      ["Dik atılan taş neden geri düşer?","Yerçekimi çeker",["Hava iter","Bulutlar iter","Yağmur düşürür"]],
      ["Bisiklet freninin yaptığı kuvvet nedir?","Sürtünme kuvveti",["Çekme","İtme","Yerçekimi"]],
      ["Futbol topunu tekmelemek hangi kuvvettir?","İtme kuvveti",["Çekme","Sürtünme","Yerçekimi"]],
    ],
    6: [
      ["Işık neden kaynaklar?","Güneş, lamba, ateş",["Taş","Su","Toprak"]],
      ["Işık hızı yaklaşık kaçtır?","300.000 km/saniye",["3.000 km/saniye","300 km/saniye","30.000 km/saniye"]],
      ["Ses havada mı, suda mı, yoksa katıda mı daha hızlı ilerler?","Katıda",["Havada","Suda","Hızlıkları eşit"]],
      ["Ses oluşmak için ne gerekir?","Titreşim",["Işık","Isı","Su"]],
      ["Hangi ortamda ses yayılmaz?","Boşlukta",["Havada","Suda","Katı maddelerde"]],
      ["Yansıma ne demektir?","Işığın düz yüzeyden geri dönmesi",["Işığın kırılması","Işığın emilmesi","Işığın dağılması"]],
      ["Ayna hangi tür yüzeydir?","Düzgün ve parlak",["Pürüzlü","Mat","Şeffaf"]],
      ["Prizma ışığı nasıl değiştirir?","Gökkuşağı renklerine ayırır",["Söndürür","Yansıtır","Büyütür"]],
      ["Gökkuşağının renkleri kaç tanedir?","7",["5","6","8"]],
      ["Ses yüksekliğine ne denir?","Şiddet (desibel)",["Frekans","Tonlama","Genlik"]],
      ["Ses tonu neye göre değişir?","Titreşim hızına (frekans)",["Sesin büyüklüğüne","Sesi çıkaran maddeye","Havaya"]],
      ["Karanlık bir odada görebilir miyiz?","Hayır",["Evet","Bazen","Gözlerimiz ısınırsa"]],
      ["Gölge nasıl oluşur?","Işık geçirmeyen nesnenin arkasında",["Işığın yansıması","Sesin titreşimi","Rüzgarın etkisi"]],
      ["Sabun köpükleri neden renkli görünür?","Işığı kırarak renklere ayırır",["Sabun renklidir","Hava renklidir","Köpük boyalıdır"]],
      ["Güneş ışığı tek renk midir?","Hayır, 7 renk içerir",["Evet","Sadece sarı","Sadece beyaz"]],
      ["Hangi renk en kısa dalga boyuna sahiptir?","Mor",["Kırmızı","Sarı","Yeşil"]],
      ["Hangi renk en uzun dalga boyuna sahiptir?","Kırmızı",["Mor","Mavi","Yeşil"]],
      ["Fısıltı hangi tür sestir?","Alçak sesli",["Yüksek sesli","Orta sesli","Tiz sesli"]],
      ["Kulağımız neyi algılar?","Sesi",["Işığı","Isıyı","Kokuyu"]],
      ["Gözümüz neyi algılar?","Işığı",["Sesi","Isıyı","Kokuyu"]],
    ],
    7: [
      ["Hava nelerden oluşur?","Azot, oksijen ve diğer gazlar",["Sadece oksijen","Sadece azot","Su ve karbondioksit"]],
      ["Havadaki en çok bulunan gaz hangisidir?","Azot (%78)",["Oksijen","Karbondioksit","Hidrojen"]],
      ["Hava kirliliği nasıl oluşur?","Zararlı maddelerin havaya karışmasıyla",["Yağmur yağmasıyla","Rüzgar esmesiyle","Güneş batmasıyla"]],
      ["Yağmur nasıl oluşur?","Su buharının soğuyup damla oluşturmasıyla",["Bulutların ağırlaşmasıyla","Güneşin ısıtmasıyla","Rüzgarın itmesiyle"]],
      ["Kar nedir?","Donmuş su kristalleri",["Buz parçaları","Beyaz toz","Soğuk hava"]],
      ["Dolu nedir?","Sert buz küçük topları",["Kar","Yağmur","Su buharı"]],
      ["Bulut neyden oluşur?","Su ve buz kristallerinden",["Dumandan","Kustan","Gazdan"]],
      ["Sis nedir?","Yere yakın küçük su damlacıkları",["Duman","Toz","Kar"]],
      ["Rüzgar neden oluşur?","Sıcak ve soğuk hava basınç farkından",["Denizlerden","Ağaçlardan","Güneşten doğrudan"]],
      ["Fırtına nedir?","Kuvvetli rüzgar, yağmur ve şimşekli hava",["Hafif yağmur","Kar fırtınası","Sıcak hava"]],
      ["Hava durumunu kim tahmin eder?","Meteorolog",["Coğrafyacı","Biyolog","Kimyager"]],
      ["Termometre ne ölçer?","Sıcaklık",["Nem","Yağış","Rüzgar hızı"]],
      ["Barometre ne ölçer?","Hava basıncı",["Sıcaklık","Nem","Rüzgar hızı"]],
      ["Yağmurölçer ne ölçer?","Yağış miktarı",["Nem","Sıcaklık","Rüzgar"]],
      ["İklim nedir?","Uzun yıllar ortalaması alınan hava durumu",["Günlük hava","Aylık hava","Saatlik hava"]],
      ["Ekvator çevresinde hava genellikle nasıldır?","Sıcak ve nemli",["Soğuk ve kuru","Ilık ve kuru","Soğuk ve nemli"]],
      ["Kutuplarda hava genellikle nasıldır?","Çok soğuk",["Sıcak","Ilık","Yağmurlu"]],
      ["Ozon tabakası ne işe yarar?","Zararlı UV ışınlarına karşı korur",["Yağmur oluşturur","Oksijen üretir","Sıcaklık sağlar"]],
      ["Sera etkisi ne demektir?","Dünya'nın ısının tutulması",["Sera içinde ısınma","Kışın soğuma","Yaz sıcağı"]],
      ["İklim değişikliğine ne sebep olur?","İnsan faaliyetleri ve gazlar",["Sadece güneş","Sadece volkanlar","Sadece okyanuslar"]],
    ],
    8: [
      ["İlkbaharda doğada neler olur?","Çiçekler açar, hayvanlar uyanır",["Yapraklar dökülür","Kar yağar","Her şey kurur"]],
      ["Yazın doğada neler olur?","Sıcaklık artar, bitkiler büyür",["Yapraklar dökülür","Kar yağar","Hayvanlar uykuya girer"]],
      ["Sonbaharda doğada neler olur?","Yapraklar dökülür, hava soğur",["Çiçekler açar","Kar yağar","Hayvanlar uyanır"]],
      ["Kışın doğada neler olur?","Soğuk, kar yağar, bazı hayvanlar uyur",["Çiçekler açar","Bitkiler hızla büyür","Hayvanlar çok aktiftir"]],
      ["Hangi mevsimde günler en uzundur?","Yaz",["Kış","Sonbahar","İlkbahar"]],
      ["Hangi mevsimde günler en kısadır?","Kış",["Yaz","Sonbahar","İlkbahar"]],
      ["Kış uykusu hangi hayvanlarda görülür?","Ayı, kirpi",["Kedi","At","Köpek"]],
      ["Hangi hayvan ilkbaharda göç eder?","Leylek",["Kedi","Köpek","Tavuk"]],
      ["Sonbaharda yapraklar neden dökülür?","Ağaçlar kışa hazırlanır",["Bitkiler ölür","Gübre olur","Kuşlar koparır"]],
      ["Hangi mevsimde ekin biçilir?","Yaz-Sonbahar",["Kış","İlkbahar","Her mevsim"]],
      ["Hangi mevsimde ekili alan hazırlanır?","İlkbahar",["Kış","Yaz","Sonbahar"]],
      ["Yaz mevsiminde saat kaçta güneş geç batar?","Geç (21:00 civarı)",["Erken (17:00 civarı)","Öğle (12:00 civarı)","Her gün değişir"]],
      ["Kış mevsiminde güneş ne zaman erken batar?","Erken (17:00 civarı)",["Geç (21:00 civarı)","Öğle","Hiç batmaz"]],
      ["Mevsimlerin oluşma nedeni nedir?","Dünya'nın eksen eğikliği ve Güneş'e uzaklığı",["Ayın hareketleri","Yıldızların konumu","İnsan faaliyetleri"]],
      ["Hangi mevsimde gece ve gündüz eşit uzunluktadır?","İlkbahar ve sonbaharda (ekinoks)",["Sadece yazın","Sadece kışın","Hiçbir zaman"]],
      ["Sonbahar ayları hangilerdir?","Eylül, Ekim, Kasım",["Mart, Nisan, Mayıs","Haziran, Temmuz, Ağustos","Aralık, Ocak, Şubat"]],
      ["Hangi hayvan yaz mevsiminde en aktif görünür?","Arı",["Ayı","Kirpi","Yarasa"]],
      ["Hangi mevsimde çiçekler açar?","İlkbahar",["Kış","Sonbahar","Her mevsim"]],
      ["Türkiye'de kışın genellikle hangi bölgede kar yağar?","Doğu Anadolu",["Ege kıyıları","Akdeniz kıyıları","Her bölgede eşit"]],
      ["Hangi mevsimde tarla ve bahçeler sulanır?","Yaz",["Kış","Eşit sulanır","Sonbahar"]],
    ],
    9: [
      ["Sağlıklı kalmak için her gün ne yapılmalıdır?","Düzenli egzersiz ve beslenme",["Çok uyumak","Hiç hareket etmemek","Sadece su içmek"]],
      ["Dişlerimizi günde kaç kez fırçalamalıyız?","2 kez (sabah ve gece)",["1 kez","3 kez","Haftada bir"]],
      ["Ellerimizi ne zaman yıkamalıyız?","Yemekten önce ve sonra, tuvaletten sonra",["Sadece akşamları","Sadece sabahları","Hiç gerekmiyor"]],
      ["Hangi besin grubu kasları güçlendirir?","Protein (et, yumurta, baklagil)",["Şeker","Yağ","Tuz"]],
      ["Hangi besin grubu enerji verir?","Karbonhidrat (ekmek, pirinç)",["Protein","Su","Vitamin"]],
      ["Hangi besin grubu kemikleri sağlamlaştırır?","Kalsiyum (süt, peynir)",["Şeker","Yağ","Tuz"]],
      ["Uyku sağlık için önemli midir?","Evet",["Hayır","Bazen","Sadece büyükler için"]],
      ["Bir çocuğun günde kaç saat uyuması önerilir?","9-11 saat",["4-5 saat","6-7 saat","12-14 saat"]],
      ["Sigara içmek sağlığa zararlı mıdır?","Evet",["Hayır","Bazen","Sadece çocuklar için"]],
      ["Çok şeker yemenin sağlığa zararı nedir?","Dişleri çürütür, şişmanlık",["Güçlendirir","Faydalıdır","Vitamini artırır"]],
      ["İnsan vücudunun %60'ı nedir?","Su",["Kalsiyum","Demir","Protein"]],
      ["Hangi besin vitaminler bakımından zengindir?","Meyve ve sebze",["Et","Ekmek","Şeker"]],
      ["Virüs nedir?","Hastalık yapan mikro organizma",["Vitamin","Besin","Kemik"]],
      ["Aşı ne işe yarar?","Hastalıklardan korur",["Enerji verir","Ağrı keser","Uyutur"]],
      ["Antibiyotik ne için kullanılır?","Bakteri enfeksiyonları için",["Vitamin eksikliği","Ağrı","Uyku"]],
      ["Hangi vitamin güneş ışığından alınır?","D vitamini",["A vitamini","B vitamini","C vitamini"]],
      ["Hangi vitamin portakalda bol bulunur?","C vitamini",["D vitamini","B vitamini","A vitamini"]],
      ["Hangi mineral kemikler için önemlidir?","Kalsiyum",["Demir","Sodyum","Potasyum"]],
      ["Hangi besinin fazla tüketimi tansa neden olur?","Tuz",["Şeker","Protein","Su"]],
      ["Düzenli spor yapmak ne sağlar?","Kas güçlenmesi, kalp sağlığı",["Kilo aldırır","Hastalık yapar","Uyku bozukluğu"]],
    ],
    10: [
      ["Çevre kirliliği nedir?","Doğanın zararlı maddelerle bozulması",["Hava temizlenmesi","Suyun durulması","Toprağın zenginleşmesi"]],
      ["Geri dönüşüm ne demektir?","Atıkları yeniden kullanılabilir hale getirme",["Çöpleri denize dökme","Toprağa gömme","Yakma"]],
      ["Hangi atık geri dönüştürülür?","Kağıt, cam, plastik",["Her şey","Sadece cam","Sadece kağıt"]],
      ["Ormanlar neden önemlidir?","Oksijen üretir, erozyonu önler",["Sadece yakacak sağlar","Sadece hayvan barınak","Hiçbir önemi yok"]],
      ["Çevre için neler yapabiliriz?","Geri dönüşüm, su tasarrufu, ağaç dikme",["Çok plastik kullanmak","Araba egzozu bırakmak","Ormanları kesmek"]],
      ["Yenilenebilir enerji kaynağı hangisidir?","Güneş enerjisi",["Kömür","Doğalgaz","Petrol"]],
      ["Fosil yakıtlar neden zararlıdır?","Hava kirliliği ve sera etkisi yapar",["Enerji sağlar","Doğaya yardımcıdır","Suyu temizler"]],
      ["Su tasarrufu neden önemlidir?","Su kaynakları sınırlıdır",["Su boldur","Suya ihtiyaç yoktur","Su her zaman temizdir"]],
      ["Asit yağmuru nedir?","Hava kirliliğinden kaynaklanan zararlı yağmur",["Temiz yağmur","Kar","Dolu"]],
      ["Hangi hayvan nesli tehlikededir?","Panda",["Kedi","Köpek","Tavuk"]],
      ["Biyoçeşitlilik nedir?","Farklı canlı türlerinin varlığı",["Tek tür bitki","Tek tür hayvan","Homojen bir ekosistem"]],
      ["Erozyon nedir?","Toprağın su ve rüzgar tarafından taşınması",["Toprağın zenginleşmesi","Bitki büyümesi","Yağmur yağması"]],
      ["Orman yangını sonucu ne olur?","Birçok canlı yok olur, hava kirlenir",["Toprak zenginleşir","Bitkiler hızla büyür","Su artar"]],
      ["Plastik torbalar neden zararlıdır?","Uzun yıllar bozulmaz, canlılara zarar verir",["Çabuk erir","Yararlıdır","Güzeldir"]],
      ["Hangi enerji kaynağı yenilenebilirdir?","Rüzgar enerjisi",["Kömür","Doğalgaz","Petrol"]],
      ["İnsan hangi gazı solunum için alır?","Oksijen",["Karbondioksit","Azot","Hidrojen"]],
      ["Bitkiler hangi gazı havaya verir?","Oksijen",["Karbondioksit","Azot","Hidrojen"]],
      ["Hangi madde toprağı kirletir?","Gübre fazlası ve kimyasal atıklar",["Su","Hava","Güneş ışığı"]],
      ["Kompost nedir?","Organik atıklardan elde edilen gübre",["Plastik geri dönüşüm","Kimyasal ilaç","Su arıtma"]],
      ["Deniz kirliliğine ne sebep olur?","Atık madde ve plastik dökümü",["Dalgalar","Balıklar","Deniz yosunu"]],
    ],
  };
  const pool = all[tema] || all[1];
  return pool.map(([t,a,...w]) => {
    const wrongs = (w.length === 1 && Array.isArray(w[0])) ? w[0] : w;
    return q(S,T,t,a,wrongs);
  }).slice(0, 100);
}

// ================================================================
// HAYAT BİLGİSİ
// ================================================================

function hayatTema(tema) {
  const S = 'Hayat Bilgisi', T = `Tema ${tema}`;
  const all = {
    1: [
      ["Ailenin en küçük bireyine ne denir?","Bebek",["Dede","Teyze","Amca"]],
      ["Anne ve babanın annesi kimdir?","Büyükanne (Nine)",["Teyze","Hala","Abla"]],
      ["Anne ve babanın babası kimdir?","Büyükbaba (Dede)",["Amca","Dayı","Abi"]],
      ["Annenin kız kardeşi kimdir?","Teyze",["Hala","Yenge","Nine"]],
      ["Babanın kız kardeşi kimdir?","Hala",["Teyze","Yenge","Nine"]],
      ["Annenin erkek kardeşi kimdir?","Dayı",["Amca","Abi","Dede"]],
      ["Babanın erkek kardeşi kimdir?","Amca",["Dayı","Abi","Dede"]],
      ["Kardeşlerin amcası çocuklarına ne denir?","Kuzen",["Kardeş","Arkadaş","Komşu"]],
      ["Evde en önemli kural hangisidir?","Birbirimize saygı göstermek",["Her şeyi kendim yapmak","Kimseye soru sormamak","Her istediğimi almak"]],
      ["Aile büyüklerine nasıl davranmalıyız?","Saygılı olmalıyız",["Emirler vermeliyiz","Fikir sormadan davranmalıyız","Konuşmamalıyız"]],
      ["Evde hangi sorumluluk çocuklara ait olabilir?","Odamı toplamak",["Elektrik faturası ödemek","Araba sürmek","İş kurmak"]],
      ["Aile bireyleri birbirlerine nasıl yardım etmelidir?","Anlayışlı ve destekleyici olarak",["Sadece maddi yardım","Sadece iş yaptırarak","Eleştirerek"]],
      ["Ev işleri kimlerin sorumluluğundadır?","Tüm aile bireylerinin",["Sadece annenin","Sadece babanın","Sadece çocukların"]],
      ["Aile içinde sorunlar nasıl çözülür?","Konuşarak ve anlayarak",["Bağırarak","Susarak","Kaçarak"]],
      ["'Aile' kavramı neden önemlidir?","Sevgi, güven ve destek ortamı sağlar",["Para kazandırır","Ev kirası öder","Oyuncak alır"]],
      ["Kardeşlerle nasıl geçinilmelidir?","Paylaşarak ve anlayarak",["Kavga ederek","Küserek","Hiç konuşmayarak"]],
      ["Evde izin almadan başkasının eşyasını almak doğru mu?","Hayır",["Evet","Bazen","Sadece kardeşin eşyasından"]],
      ["Anne veya baba hasta olduğunda ne yapmalıyız?","Yardım etmeliyiz ve sessiz olmalıyız",["Oynamaya devam etmeliyiz","Bağırmalıyız","Evden çıkmalıyız"]],
      ["Çocukların evdeki temel hakları nelerdir?","Sevgi, sağlık, eğitim",["Para","İstediği her şey","Yalnız kalma"]],
      ["Büyüklerimize saygı nasıl gösterilir?","Söylediklerini dinleyerek ve yardım ederek",["Emirler vererek","Onları görmezden gelerek","Sürekli oyun oynayarak"]],
    ],
    2: [
      ["Okulda kime öğretmen denir?","Bize bilgi ve beceri kazandıran kişi",["Okulun temizleyeni","Para toplayan kişi","Kapı açan kişi"]],
      ["Okul müdürü ne yapar?","Okulun yönetiminden sorumludur",["Yemek pişirir","Ders verir","Bahçeyi sular"]],
      ["Okul kantini ne işe yarar?","Yiyecek ve içecek satılır",["Oyun oynanır","Ders yapılır","Kitap okunur"]],
      ["Kütüphane nedir?","Kitapların bulunduğu ve okunduğu yer",["Yemek yenilen yer","Oyun oynanan yer","Ders kitabı satılan yer"]],
      ["Okulda teneffüste ne yapılır?","Dinlenilir ve oyun oynanır",["Sınav yapılır","Ders dinlenir","Ödev verilir"]],
      ["Okul derslerini düzenli yapmanın faydası nedir?","Öğrenmeyi pekiştirir",["Zaman kaybettirir","Arkadaşlarla oynamayı engeller","Gereksizdir"]],
      ["Okul kurallarına uymak neden önemlidir?","Düzeni sağlar ve herkesi korur",["Öğretmeni mutlu etmek için","Ceza almamak için","Zorunlu olduğu için"]],
      ["Bir okul arkadaşın zorlanıyorsa ne yapmalıyız?","Yardım etmeliyiz",["Gülerek geçmeliyiz","Görmezden gelmeliyiz","Başkasını çağırmalıyız"]],
      ["Okulda başkasına ait bir şeyi bulsak ne yapmalıyız?","Öğretmenimize vermeliyiz",["Kendimize almalıyız","Saklamamalıyız","Atmalıyız"]],
      ["Okul zamanında derste telefon kullanmak doğru mu?","Hayır",["Evet","Bazen","Sadece izinle"]],
      ["Sınıfta konuşmak istediğimizde ne yapmalıyız?","El kaldırmalıyız",["Bağırmalıyız","Arkadaşımıza fısıldamalıyız","Söylemeden konuşmalıyız"]],
      ["Arkadaşlarımızla nasıl geçinmeliyiz?","Saygılı ve paylaşımcı olarak",["Kavga ederek","Küserek","Kendimiz için düşünerek"]],
      ["Okulda ödevleri neden yapmalıyız?","Öğrendiklerimizi pekiştirmek için",["Öğretmenden korkmak için","Zorunlu olduğu için","Meşgul olmak için"]],
      ["Okul materyal (kalem, defter vb.) neden önemsenmeli?","Öğrenme araçlarıdır, değerlidir",["Sadece para ödendiği için","Zorunlu olduğu için","Büyüdükçe alınmayacağı için"]],
      ["Okulda diğer öğrencilerle kavga etmek doğru mu?","Hayır",["Evet","Bazen","Güçlü olursa"]],
      ["Sınıfta öğretmen ders anlatırken ne yapılmalıdır?","Dikkatle dinlenilmelidir",["Uyunmalıdır","Oynanmalıdır","Konuşulmalıdır"]],
      ["Okul devamsızlığı neden sakıncalıdır?","Derslerden geri kalınır",["Ev daha eğlenceli","Hiçbir sakıncası yok","Arkadaşlardan uzak kalınır sadece"]],
      ["Okul kıyafetlerine (varsa) neden özen gösterilmeli?","Temiz ve düzenli olmak önemlidir",["Sadece güzel göründüğü için","Zorunlu olduğu için","Başkaları gördüğü için"]],
      ["Okulun temizliğine katkıda bulunmak neden gereklidir?","Ortak yaşam alanımızdır",["Öğretmen temizlik ister","Para ödediğimiz için","Zorunludur"]],
      ["Veliler okula neden gelir?","Öğrencinin gelişimini takip etmek için",["Öğretmeni şikayet etmek için","Kural belirlemek için","Yemek yemek için"]],
    ],
    3: [
      ["Sağlıklı beslenmek ne demektir?","Dengeli, çeşitli ve düzenli yemek yemek",["Sadece et yemek","Sadece sebze yemek","Çok yemek yemek"]],
      ["Günde kaç öğün yemek yenmelidir?","3 ana öğün",["1 öğün","5-6 öğün","İstediğimiz kadar"]],
      ["Kahvaltı neden önemlidir?","Gün boyu enerji verir, beyin çalışmasını sağlar",["Sadece lezzetli olduğu için","Zorunlu olduğu için","Öğretmen istediği için"]],
      ["Hangi içecek en sağlıklıdır?","Su",["Gazlı içecek","Meyve suyu","Çay"]],
      ["Dişleri ne zaman fırçalamalıyız?","Sabah ve gece",["Sadece sabah","Sadece gece","Haftada bir"]],
      ["Tırnak bakımı neden önemlidir?","Mikropların girmesini önler",["Güzel görünmek için","Oyun için","Hız için"]],
      ["Hangi alışkanlık sağlığa zararlıdır?","Sigara içmek",["Yürüyüş yapmak","Bol su içmek","Erken uyumak"]],
      ["Spor yapmanın faydaları nelerdir?","Kas güçlenir, sağlıklı kalınır",["Vakit geçirir","Yorucu olur","Faydasızdır"]],
      ["Hangi yiyecek kemikleri güçlendirir?","Süt ve süt ürünleri",["Şeker","Gazlı içecek","Tatlılar"]],
      ["Vücudumuzu mikroplardan korumak için ne yapmalıyız?","Sık sık el yıkamalıyız",["Sadece ilaç içmeliyiz","Evde kalmalıyız","Maske takmalıyız"]],
      ["Uyku kaç satten az olursa zararlı olur?","8-9 saatten az",["12 saatten az","5 saatten az","3 saatten az"]],
      ["Ekran başında (TV, tablet) çok vakit geçirmek neden zararlıdır?","Göz yorar, hareketi azaltır",["Faydalıdır","Eğitim verir","Zararlı değildir"]],
      ["Temiz kıyafet giymek neden önemlidir?","Mikropları azaltır ve kendinizi iyi hissettirirsiniz",["Sadece güzel görünmek için","Zorunlu olduğu için","Başkalarını etkilemek için"]],
      ["Hastalık olduğunda ne yapmalıyız?","Doktora gitmeliyiz",["İlaç kendi kendine almalıyız","Okula gitmeliyiz","Beklemeliyiz"]],
      ["Hangi yiyecek vitaminler bakımından zengindir?","Taze meyve ve sebze",["Şeker","Cips","Hamburger"]],
      ["Güneş çarpmamak için ne yapılmalıdır?","Şapka takılmalı, su içilmeli",["Çok koşulmalı","Hiç su içilmemeli","Güneşte uyunmalı"]],
      ["Hangi hastalık kirli elle bulaşabilir?","İshal ve mide enfeksiyonları",["Kırık kemik","Göz rengi","Sarışınlık"]],
      ["Aşı olmak neden önemlidir?","Hastalıklara karşı bağışıklık sağlar",["Acımasız olduğu için","Zararlıdır","Faydasızdır"]],
      ["Yaralandığımızda ne yapmalıyız?","Büyüklere haber vermeliyiz",["Saklamalıyız","Devam etmeliyiz","Beklemeliyiz"]],
      ["Çiğ et yemek neden tehlikelidir?","Zararlı bakteriler içerebilir",["Lezzetli değil","Soğuktur","Pahalıdır"]],
    ],
    4: [
      ["Kırmızı trafik ışığı ne anlama gelir?","Dur",["Geç","Dikkat et","Yavaşla"]],
      ["Sarı trafik ışığı ne anlama gelir?","Dikkatli ol, hazırlan",["Dur","Geç","Hızlan"]],
      ["Yeşil trafik ışığı ne anlama gelir?","Geç",["Dur","Dikkat et","Yavaşla"]],
      ["Yayalar nerede yürümelidir?","Kaldırımda",["Yolda","Bisiklet yolunda","Köprüde"]],
      ["Yayalar yolu nerede ve nasıl geçmelidir?","Yaya geçidinden, ışığı bekleyerek",["Rastgele","İstedikleri yerden","Hızlıca koşarak"]],
      ["Araçlara binmeden önce ne takılmalıdır?","Emniyet kemeri",["Kask","Yağmurluk","Eldiven"]],
      ["Bisiklet sürerken ne takılmalıdır?","Kask",["Şapka","Eldiven","Yağmurluk"]],
      ["Çocuklar araçtan nerede inmeli ve binmeli?","Kaldırım tarafından",["Yol tarafından","İstedikleri taraftan","Sürücü tarafından"]],
      ["Araçlar şehir içinde hangi hızda olmalıdır?","50 km/saat",["100 km/saat","150 km/saat","200 km/saat"]],
      ["Okul önünde araçlar neden yavaşlamalıdır?","Çocuklar yola çıkabilir",["Yakıt tasarrufu için","Çarpışmak için","Duraksama noktası olduğu için"]],
      ["Trafik polisi ne iş yapar?","Trafik kurallarını denetler",["Arabayı tamir eder","Yol yapar","Benzin satar"]],
      ["Yolda oynamak tehlikeli midir?","Evet",["Hayır","Bazen","Sadece gece"]],
      ["Araçların gidemeyeceği yollar nelerdir?","Yayaların yolu (kaldırım)",["Otoyol","Park","Köprü"]],
      ["Trafik işaretleri ne için kullanılır?","Sürücülere ve yayalara yol gösterir",["Şehri süslemek için","Reklam için","Binalara işaret etmek için"]],
      ["'Dur' levhası ne anlama gelir?","Taşıt mutlaka durmalıdır",["Yavaşla","Dikkat et","Geç"]],
      ["Gece yolda yürürken ne yapılmalıdır?","Açık renkli kıyafet giyilmeli, görünür olunmalı",["Koşulmalı","Araçların ortasında yürünmeli","Işık söndürülmeli"]],
      ["Araç içinde şakalaşmak ya da bağırmak neden tehlikelidir?","Sürücünün dikkatini dağıtır",["Eğlencelidir","Hızı artırır","Yakıt tüketir"]],
      ["Trafik kazasında ne yapılmalıdır?","İmdat çağrılmalı, 112'yi aranmalı",["Sahneyi terk etmeli","Birşey yapmadan beklemeli","Sadece bakılmalı"]],
      ["Trafik lambası bozuksa ne yapılmalıdır?","Yavaşlanmalı, dikkat edilmeli",["Hızlanılmalı","Her zamanki gibi geçilmeli","Gözler kapatılmalı"]],
      ["Ambulans geldiğinde araçlar ne yapmalıdır?","Yol açmalıdır",["Hızlanmalıdır","Durmalı beklemeli","Üzerine geçmeli"]],
    ],
    5: [
      ["Doktor ne iş yapar?","Hastaları tedavi eder",["Yemek pişirir","Araba tamir eder","Ev yapar"]],
      ["Öğretmen ne iş yapar?","Öğrencilere bilgi ve beceri kazandırır",["Yemek pişirir","Araba tamir eder","Binaları temizler"]],
      ["Polis ne iş yapar?","Güvenliği sağlar ve suçları önler",["Yemek pişirir","Bina yapar","Trafik ışıkları yapar"]],
      ["İtfaiyeci ne iş yapar?","Yangınları söndürür ve kurtarma yapar",["Yemek pişirir","Araba satar","Ev yapar"]],
      ["Eczacı ne iş yapar?","İlaç hazırlar ve satar",["Yemek pişirir","Araba tamir eder","Bina yapar"]],
      ["Aşçı ne iş yapar?","Yemek pişirir",["Araba tamir eder","Bina yapar","Hastalık tedavi eder"]],
      ["Mühendis ne iş yapar?","Tasarım ve teknik çözümler üretir",["Yemek pişirir","İlaç yapar","Konser verir"]],
      ["Avukat ne iş yapar?","Hukuki davalarda müvekkilleri savunur",["Araba tamir eder","Yemek pişirir","İlaç satar"]],
      ["Berber/kuaför ne iş yapar?","Saç keser ve şekillendirir",["Ev yapar","İlaç satar","Araba tamir eder"]],
      ["Kasap ne iş yapar?","Et satar ve hazırlar",["İlaç satar","Araba tamir eder","Saç keser"]],
      ["Garson ne iş yapar?","Restorantta müşterilere servis yapar",["Yemek pişirir","Bina yapar","İlaç satar"]],
      ["Hemşire ne iş yapar?","Hasta bakımı yapar, doktora yardım eder",["Araba tamir eder","Bina yapar","Yemek pişirir"]],
      ["Pilot ne iş yapar?","Uçak uçurur",["Araba sürer","Gemi sürer","Tren sürer"]],
      ["Makinist ne iş yapar?","Tren kullanır",["Gemi sürer","Uçak uçurur","Araba tamir eder"]],
      ["Çiftçi ne iş yapar?","Tarla sürüp ekip biçer",["İlaç yapar","Araba tamir eder","Ev yapar"]],
      ["Ressam ne iş yapar?","Resim yapar",["Müzik çalar","Yemek pişirir","Araba tamir eder"]],
      ["Müzisyen ne iş yapar?","Müzik çalar veya söyler",["Resim yapar","Yemek pişirir","Bina yapar"]],
      ["Gazeteci ne iş yapar?","Haber hazırlar ve yayınlar",["Resim yapar","Yemek pişirir","İlaç satar"]],
      ["Çevre işçisi ne iş yapar?","Sokakları temizler ve çöp toplar",["Yemek pişirir","Bina yapar","İlaç satar"]],
      ["Banka çalışanı ne iş yapar?","Para ve finansal işlem yapar",["Yemek pişirir","İlaç satar","Araba tamir eder"]],
    ],
    6: [
      ["Türkiye'nin başkenti neresidir?","Ankara",["İstanbul","İzmir","Bursa"]],
      ["Türkiye Cumhuriyeti ne zaman kuruldu?","1923",["1923","1918","1930","1950"]],
      ["Türkiye Cumhuriyeti'nin kurucusu kimdir?","Mustafa Kemal Atatürk",["İsmet İnönü","Mehmet Akif Ersoy","Rauf Orbay"]],
      ["23 Nisan ne günüdür?","Ulusal Egemenlik ve Çocuk Bayramı",["Cumhuriyet Bayramı","Zafer Bayramı","Atatürk'ü Anma Günü"]],
      ["29 Ekim ne günüdür?","Cumhuriyet Bayramı",["Çocuk Bayramı","Zafer Bayramı","Anneler Günü"]],
      ["19 Mayıs ne günüdür?","Atatürk'ü Anma, Gençlik ve Spor Bayramı",["Cumhuriyet Bayramı","Çocuk Bayramı","Zafer Bayramı"]],
      ["30 Ağustos ne günüdür?","Zafer Bayramı",["Cumhuriyet Bayramı","Çocuk Bayramı","Anneler Günü"]],
      ["Türk bayrağının renkleri nelerdir?","Kırmızı ve beyaz",["Mavi ve beyaz","Yeşil ve kırmızı","Sarı ve kırmızı"]],
      ["Türk bayrağındaki semboller nelerdir?","Ay ve yıldız",["Güneş ve ay","Yıldız ve güneş","Ay ve güneş"]],
      ["İstiklal Marşı'nı kim yazmıştır?","Mehmet Akif Ersoy",["Atatürk","Namık Kemal","Tevfik Fikret"]],
      ["'Egemenlik kayıtsız şartsız milletindir.' sözü kime aittir?","Atatürk",["İsmet İnönü","Rauf Orbay","Ali Fuat"]],
      ["Türkiye'nin para birimi nedir?","Türk Lirası",["Euro","Dolar","Frank"]],
      ["Türkiye'nin nüfusu ne kadardır?","Yaklaşık 85 milyon",["10 milyon","50 milyon","200 milyon"]],
      ["Türkiye'nin en büyük şehri hangisidir?","İstanbul",["Ankara","İzmir","Bursa"]],
      ["Türkiye'nin hangi kıtalarda toprakları bulunur?","Asya ve Avrupa",["Sadece Asya","Sadece Avrupa","Asya ve Afrika"]],
      ["Ramazan Bayramı kaç gün sürer?","3 gün",["1 gün","5 gün","7 gün"]],
      ["Kurban Bayramı kaç gün sürer?","4 gün",["2 gün","3 gün","7 gün"]],
      ["Nevruz ne zaman kutlanır?","21 Mart",["21 Haziran","21 Aralık","21 Eylül"]],
      ["Türkiye'nin bağımsız olduğu günü kutlayan bayram hangisidir?","Cumhuriyet Bayramı",["Zafer Bayramı","Gençlik Bayramı","Çocuk Bayramı"]],
      ["Atatürk'ün vefat ettiği tarih hangisidir?","10 Kasım 1938",["29 Ekim 1923","19 Mayıs 1919","30 Ağustos 1922"]],
    ],
    7: [
      ["Orman neden önemlidir?","Oksijen üretir, hayvan barınağı sağlar",["Yakıt sağlar yalnızca","Faydasızdır","Su sağlar yalnızca"]],
      ["Toprak erozyonu nedir?","Toprağın su veya rüzgarla taşınması",["Toprağın zenginleşmesi","Toprak rengi değişmesi","Toprak donması"]],
      ["Hangi faaliyet erozyona neden olur?","Ağaç kesimi",["Ağaç dikme","Çim ekilmesi","Tarım"]],
      ["Doğayı kirletmek doğru mu?","Hayır",["Evet","Bazen","Sadece az kirletmek"]],
      ["Doğal kaynaklar nelerdir?","Su, orman, toprak, madenler",["Para, araba, bina","Kalem, kitap, sandalye","Ekmek, et, meyve"]],
      ["Su kaynakları nasıl korunur?","Tasarruflu kullanılır, kirletilmez",["Çok kirletilir","Sadece yazın korunur","Korunmaz"]],
      ["Hangi madde doğada uzun süre bozulmaz?","Plastik",["Kağıt","Meyve kabuğu","Taş (gübre olur)"]],
      ["Geri dönüşüm kutularının renkleri ne anlama gelir?","Farklı atık türlerini gösterir",["Kutuların güzel görünmesi","Bir önemi yok","Kutuların yaşını gösterir"]],
      ["Yabani hayvanları beslemek her zaman iyi midir?","Hayır, onlara zarar verebilir",["Evet, her zaman iyi","Bazen iyidir","Kedi için iyidir"]],
      ["Piknikte ne yapmamalıyız?","Çöpü doğaya bırakmamalıyız",["Eğlenmeli","Doğayı izlemeli","Yürüyüş yapmalı"]],
      ["Göl, nehir ve denizlere çöp atmak doğru mu?","Hayır",["Evet","Bazen","Küçük çöpler olsa tamam"]],
      ["Sessiz doğada hayvanlar nasıl davranır?","Daha rahat ve huzurludur",["Daha gergin","Kaçar","Saldırır"]],
      ["Hangi hayvanlar nesli tehlikede?","Panda, Amur leoparı",["Kedi","Köpek","Tavuk"]],
      ["Doğal afet öncesinde ne yapılmalıdır?","Hazırlıklı olunmalı, plan yapılmalı",["Paniklenilmeli","Hiçbir şey","Uyunmalı"]],
      ["Depremde ne yapılmalıdır?","Masa altına saklanılmalı veya dışarı çıkılmalı",["Pencere altına gidilmeli","Yatağa uzanılmalı","Kapıya dayalı durulmalı"]],
      ["Su tasarrufu için ne yapılabilir?","Akan musluğu kapatmak","Su dökmek","Uzun duş almak","Suyu depolamamak"],
      ["Hangi bitki çölde yaşayabilir?","Kaktüs",["Lale","Papatya","Kavak"]],
      ["Denizlerde kirlilik hangi sonucu doğurur?","Deniz canlılarının zarar görür",["Balıklar çoğalır","Su temizlenir","Faydalıdır"]],
      ["Hangi enerji çevre dostu?","Güneş ve rüzgar enerjisi",["Kömür","Doğalgaz","Petrol"]],
      ["Çevre kirliliğini azaltmak için ne yapabiliriz?","Toplu taşıma kullanmak, geri dönüşüm",["Daha fazla araba kullanmak","Daha fazla plastik tüketmek","Enerji israf etmek"]],
    ],
    8: [
      ["Hak nedir?","Herkese tanınan özgürlük ve koruma",["Para kazanma","Sorumluluk","Görev"]],
      ["Sorumluluk nedir?","Üstlenilen görev veya ödev",["Hak","Para","Seçim"]],
      ["Çocukların hakları nelerdir?","Eğitim, sağlık, sevgi, koruma",["Sadece eğitim","Sadece sağlık","Sadece oyun"]],
      ["BM Çocuk Hakları Sözleşmesi ne anlama gelir?","Tüm çocukların haklarını korur",["Sadece zenginlerin haklarını korur","Sadece Türk çocuklarını korur","Haklarla ilgisi yok"]],
      ["Eğitim çocukların hakkı mıdır?","Evet",["Hayır","Bazen","Sadece kız çocukların"]],
      ["Okula gidemeyecek kadar hasta olan çocuğun hakkı?","Tedavi olma ve evde eğitim hakkı",["Okula yine de gitme","Tatil yapma","Yoktur"]],
      ["Baskı ile zorla çalıştırılmak çocuk hakkı mıdır?","Hayır, bu bir ihlaldir",["Evet","Bazen","Sadece büyük çocuklar için"]],
      ["Okula gitme hakkı neden önemlidir?","Geleceğimizi inşa eder",["Zorunlu olduğu için","Arkadaş edinmek için","Para kazanmak için"]],
      ["Oyun oynamak çocukların hakkı mıdır?","Evet",["Hayır","Sadece izinle","Tatilde evet"]],
      ["Arkadaşlarınızı dışlamak ya da zorbalık yapmak nedir?","Hak ihlalidir",["Normal bir davranıştır","Oyun davranışıdır","Bazen kabul edilebilir"]],
      ["Zorbalığa uğradığımızda ne yapmalıyız?","Güvendiğimiz bir büyüğe söylemeliyiz",["Susmalıyız","Kaçmalıyız","Daha çok sinir olmalıyız"]],
      ["Başkasına zarar vermek doğru mu?","Hayır",["Evet","Bazen","Küçük zararlarda tamam"]],
      ["Herkesin farklı olması güzel mi?","Evet, çeşitlilik zenginliktir",["Hayır, hepimiz aynı olmalıyız","Bazen güzel","Sadece büyüklere güzel"]],
      ["Bir arkadaşın yanlış bir şey yapıyorsa ne yapmalısın?","Nezaketle uyarmalı ya da öğretmene söylemeliyiz",["Katılmalıyız","Görmezden gelmeliyiz","Bağırmalıyız"]],
      ["Başkasının eşyasını izinsiz almak nedir?","Yanlış ve hırsızlık",["Normal","Oyun","Şaka"]],
      ["Bayramlarda büyüklerin elini öpmek neden gelenektir?","Saygı ve sevgi göstergesidir",["Para için","Zorunlu olduğu için","Hiçbir sebebi yok"]],
      ["Komşulara yardım etmek önemli midir?","Evet",["Hayır","Sadece aile yardım eder","Zorunlu değil"]],
      ["Engelli bireylere nasıl davranılmalıdır?","Saygı ve anlayışla",["Görmezden gelerek","Yardım etmek zorundayız","Uzaktan bakarak"]],
      ["Farklı kültürlerden insanlara nasıl davranmalıyız?","Saygı ve merakla",["Reddederek","Korku ile","Görmezden gelerek"]],
      ["İnsan hakları evrensel midir?","Evet, tüm insanlar için geçerlidir",["Hayır","Sadece belirli ülkeler için","Sadece yetişkinler için"]],
    ],
    9: [
      ["Telefon ne işe yarar?","İletişim sağlar",["Yemek pişirir","Su ısıtır","Araba sürer"]],
      ["Bilgisayar ne işe yarar?","Bilgi işleme ve iletişim",["Yemek pişirir","Su ısıtır","Araba sürer"]],
      ["İnternet ne işe yarar?","Bilgiye ulaşmayı ve iletişimi sağlar",["Yemek pişirir","Araba sürer","Su doldurur"]],
      ["Sosyal medyayı doğru kullanmak neden önemlidir?","Kötüye kullanım zarar verir",["Faydasızdır","Her zaman iyidir","Zorunlu değildir"]],
      ["Yabancılarla çevrimiçi iletişim neden riskli olabilir?","Güvenilir olmayabilirler",["Her zaman güvenlidir","Faydalıdır","Zorunlu bir şeydir"]],
      ["Oyun oynamak için teknoloji her zaman gerekli midir?","Hayır, teknolojisiz oyunlar da var",["Evet","Bazen","Sadece büyük çocuklar için hayır"]],
      ["Elektrik neden tasarruflu kullanılmalıdır?","Enerji kaynakları sınırlıdır ve para tasarrufu sağlar",["Elektrik yenilenebilirdir","Fatura yok","Sınırsızdır"]],
      ["Çamaşır makinesi ne işe yarar?","Çamaşırları yıkar",["Bulaşıkları yıkar","Yemek pişirir","Su ısıtır"]],
      ["Bulaşık makinesi ne işe yarar?","Bulaşıkları yıkar",["Çamaşırları yıkar","Yemek pişirir","Su ısıtır"]],
      ["Trafik ışıkları akıllı hale gelebilir mi?","Evet, trafik durumuna göre ayarlanabilir",["Hayır","Zaten mükemmel","Sadece büyük şehirlerde"]],
      ["Robot nedir?","Programlanmış makine",["Canlı varlık","Oyuncak","Araba"]],
      ["Tablet ile kitap arasındaki fark nedir?","Tablet elektronik, kitap kağıttır",["İkisi aynıdır","Tablette bilgi yoktur","Kitaplarda resim yoktur"]],
      ["Akıllı telefonun zararlarından biri nedir?","Aşırı kullanım dikkat dağıtır",["İletişim engeller","Bilgiye erişimi azaltır","Sağlıklıdır"]],
      ["GPS ne işe yarar?","Konum belirler ve yol tarif eder",["Hava durumu bildirir","Müzik çalar","Fotoğraf çeker"]],
      ["Sosyal medyada kişisel bilgiler paylaşılmalı mı?","Hayır",["Evet","Bazen","Sadece fotoğraf"]],
      ["Teknolojinin getirdiği en büyük faydalardan biri?","Hızlı iletişim ve bilgiye erişim",["Hareketsizlik","Tembel olma","Kitap okumama"]],
      ["E-kitap nedir?","Elektronik ortamdaki kitap",["Kağıt kitap","Dergiler","Çizgi romanlar"]],
      ["Akıllı ev nedir?","Teknoloji ile kontrol edilen ev",["Pahalı ev","Büyük ev","Eski ev"]],
      ["Elektrik düğmesi kullanılmadığında ne yapılmalıdır?","Kapatılmalıdır",["Açık bırakılmalıdır","Söküp alınmalıdır","Kırılmalıdır"]],
      ["Enerji tasarrufu için neler yapılabilir?","Kullanılmayan cihazları kapatmak",["Daha fazla cihaz kullanmak","Tüm gece ışıkları açık bırakmak","Isıtmayı artırmak"]],
    ],
    10: [
      ["Türkiye'nin en uzun ırmağı hangisidir?","Kızılırmak",["Fırat","Dicle","Sakarya"]],
      ["Türkiye'de kaç il vardır?","81",["73","79","83"]],
      ["Türkiye'nin denizlere kıyısı var mıdır?","Evet, 4 denize",["Hayır","Sadece 1 denize","Sadece 2 denize"]],
      ["Kış tatili genellikle kaç haftadır?","2 hafta",["1 hafta","3 hafta","4 hafta"]],
      ["Türk mutfağının en tanınan yiyeceği nedir?","Kebap",["Hamburger","Pizza","Sushi"]],
      ["Türkiye hangi kıtadadır?","Asya ve Avrupa",["Sadece Asya","Sadece Avrupa","Afrika"]],
      ["Türk Dil Kurumu ne yapır?","Türkçenin gelişimi ve korunmasından sorumludur",["Hukuk işleri","Sağlık hizmetleri","Trafik düzenlemesi"]],
      ["Türkiye'nin iklimi nasıldır?","Karasal, Akdeniz ve Karadeniz iklimi bir arada",["Sadece çöl","Sadece tropikal","Sadece arktik"]],
      ["Türk kahvaltısında hangi yiyecek önemlidir?","Peynir, zeytin, yumurta",["Hamburger","Pizza","Sushi"]],
      ["Nasreddin Hoca hangi şehirden?","Akşehir",["Ankara","İstanbul","İzmir"]],
      ["Efes antik kenti hangi şehirimizde?","İzmir (Selçuk)",["Ankara","İstanbul","Antalya"]],
      ["Kapadokya nerede yer alır?","Nevşehir çevresinde",["Ankara'da","İstanbul'da","İzmir'de"]],
      ["Pamukkale nerede bulunur?","Denizli",["İzmir","Ankara","Bursa"]],
      ["Boğaziçi Köprüsü hangi şehirdedir?","İstanbul",["Ankara","İzmir","Bursa"]],
      ["Türkiye'nin kuruluşunu hangi antlaşma tescil etmiştir?","Lozan Antlaşması",["Sevr Antlaşması","Paris Antlaşması","Mondros Antlaşması"]],
      ["Türkiye'de en çok konuşulan dil hangisidir?","Türkçe",["Kürtçe","Arapça","İngilizce"]],
      ["Türkiye'nin en yüksek dağı hangisidir?","Ağrı Dağı",["Uludağ","Erciyes","Süphan Dağı"]],
      ["Van Gölü hangi tür göldür?","Kapalı havza gölü (tuzlu)",["Tatlı su gölü","Yapay göl","Doğal büyük göl"]],
      ["Türkiye hangi mevsimde en çok turist alır?","Yaz",["Kış","İlkbahar","Sonbahar"]],
      ["Türk bayrağındaki yıldız kaç köşelidir?","5 köşeli",["4 köşeli","6 köşeli","8 köşeli"]],
    ],
  };
  const pool = all[tema] || all[1];
  return pool.map(([t,a,...w]) => {
    const wrongs = (w.length === 1 && Array.isArray(w[0])) ? w[0] : w;
    return q(S,T,t,a,wrongs);
  }).slice(0, 100);
}

// ================================================================
// İNGİLİZCE
// ================================================================

function englishTema(tema) {
  const S = 'İngilizce', T = `Tema ${tema}`;
  const all = {
    1: [
      ["What do you say when you meet someone for the first time?","Nice to meet you",["Goodbye","See you later","Good night"]],
      ["How do you greet someone in the morning?","Good morning",["Good night","Good evening","Good afternoon"]],
      ["How do you greet someone in the afternoon?","Good afternoon",["Good morning","Good night","Hello"]],
      ["How do you greet someone in the evening?","Good evening",["Good morning","Good afternoon","Good night"]],
      ["How do you say goodbye?","Goodbye",["Hello","Good morning","Nice to meet you"]],
      ["What does 'Hello' mean in Turkish?","Merhaba",["Güle güle","İyi günler","Teşekkür ederim"]],
      ["What does 'Thank you' mean?","Teşekkür ederim",["Lütfen","Özür dilerim","Güle güle"]],
      ["What does 'Please' mean?","Lütfen",["Teşekkür ederim","Özür dilerim","Güle güle"]],
      ["What does 'Sorry' mean?","Özür dilerim",["Lütfen","Teşekkür ederim","Güle güle"]],
      ["What does 'Yes' mean?","Evet",["Hayır","Belki","Lütfen"]],
      ["What does 'No' mean?","Hayır",["Evet","Belki","Tamam"]],
      ["What does 'OK' mean?","Tamam",["Hayır","Evet","Lütfen"]],
      ["How do you ask someone's name?","What is your name?",["How are you?","Where are you?","How old are you?"]],
      ["How do you ask someone's age?","How old are you?",["What is your name?","Where are you?","How are you?"]],
      ["How do you ask how someone is?","How are you?",["What is your name?","Where are you?","How old are you?"]],
      ["What is the answer to 'How are you?'","I am fine, thank you.",["My name is...","I am 8 years old.","I live in Turkey."]],
      ["What does 'My name is...' mean?","Benim adım...",["Ben ... yaşındayım.","... yaşıyorum.","Adım yok."]],
      ["What does 'I am 8 years old.' mean?","Ben 8 yaşındayım.",["Benim adım 8.","Ben 8 cm'yim.","Ben 8 kiloyum."]],
      ["What does 'See you later' mean?","Görüşürüz",["Günaydın","İyi geceler","Merhaba"]],
      ["What does 'Good night' mean?","İyi geceler",["Günaydın","Merhaba","Güle güle"]],
    ],
    2: [
      ["What color is the sky?","Blue",["Red","Green","Yellow"]],
      ["What color is grass?","Green",["Blue","Red","Yellow"]],
      ["What color is the sun?","Yellow",["Blue","Green","Red"]],
      ["What color is a tomato?","Red",["Blue","Green","Yellow"]],
      ["What color is snow?","White",["Black","Blue","Red"]],
      ["What color is night?","Black",["White","Blue","Red"]],
      ["What color is an orange?","Orange",["Blue","Green","Red"]],
      ["What color is a grape?","Purple",["Blue","Green","Red"]],
      ["What color is chocolate?","Brown",["Black","Blue","Orange"]],
      ["How many sides does a triangle have?","3",["4","5","6"]],
      ["How many sides does a square have?","4",["3","5","6"]],
      ["How many sides does a circle have?","0",["1","2","3"]],
      ["What is the Turkish for 'red'?","Kırmızı",["Mavi","Yeşil","Sarı"]],
      ["What is the Turkish for 'blue'?","Mavi",["Kırmızı","Yeşil","Sarı"]],
      ["What is the Turkish for 'green'?","Yeşil",["Kırmızı","Mavi","Sarı"]],
      ["What is the Turkish for 'yellow'?","Sarı",["Kırmızı","Mavi","Yeşil"]],
      ["What is the Turkish for 'white'?","Beyaz",["Siyah","Kırmızı","Mavi"]],
      ["What is the Turkish for 'black'?","Siyah",["Beyaz","Kırmızı","Mavi"]],
      ["What shape is a ball?","Sphere / Circle",["Square","Triangle","Rectangle"]],
      ["What shape is a book?","Rectangle",["Circle","Triangle","Square"]],
    ],
    3: [
      ["What is 'one' in Turkish?","Bir",["İki","Üç","Dört"]],
      ["What is 'two' in Turkish?","İki",["Bir","Üç","Dört"]],
      ["What is 'three' in Turkish?","Üç",["Bir","İki","Dört"]],
      ["What is 'four' in Turkish?","Dört",["Bir","İki","Üç"]],
      ["What is 'five' in Turkish?","Beş",["Altı","Yedi","Sekiz"]],
      ["What is 'six' in Turkish?","Altı",["Beş","Yedi","Sekiz"]],
      ["What is 'seven' in Turkish?","Yedi",["Altı","Sekiz","Dokuz"]],
      ["What is 'eight' in Turkish?","Sekiz",["Yedi","Dokuz","On"]],
      ["What is 'nine' in Turkish?","Dokuz",["Sekiz","On","On bir"]],
      ["What is 'ten' in Turkish?","On",["Dokuz","On bir","On iki"]],
      ["What is 'eleven' in Turkish?","On bir",["On","On iki","On üç"]],
      ["What is 'twelve' in Turkish?","On iki",["On bir","On üç","On dört"]],
      ["What is 'fifteen' in Turkish?","On beş",["On dört","On altı","On yedi"]],
      ["What is 'twenty' in Turkish?","Yirmi",["On dokuz","Yirmi bir","On sekiz"]],
      ["How many letters are in the English alphabet?","26",["24","28","30"]],
      ["What number comes after 9?","10",["8","11","12"]],
      ["What number comes before 5?","4",["3","6","7"]],
      ["1 + 1 = ? (in English, what is the answer?)","Two",["Three","One","Four"]],
      ["5 + 5 = ? (in English?)","Ten",["Eight","Nine","Eleven"]],
      ["10 - 3 = ? (in English?)","Seven",["Six","Eight","Five"]],
    ],
    4: [
      ["What animal says 'meow'?","Cat",["Dog","Cow","Horse"]],
      ["What animal says 'woof'?","Dog",["Cat","Cow","Horse"]],
      ["What animal says 'moo'?","Cow",["Dog","Cat","Sheep"]],
      ["What animal says 'baa'?","Sheep",["Dog","Cat","Cow"]],
      ["What animal can fly?","Bird",["Cat","Dog","Fish"]],
      ["What animal lives in water?","Fish",["Cat","Dog","Bird"]],
      ["What is the Turkish for 'cat'?","Kedi",["Köpek","At","İnek"]],
      ["What is the Turkish for 'dog'?","Köpek",["Kedi","At","İnek"]],
      ["What is the Turkish for 'horse'?","At",["Kedi","Köpek","İnek"]],
      ["What is the Turkish for 'cow'?","İnek",["Kedi","Köpek","At"]],
      ["What is the Turkish for 'bird'?","Kuş",["Kedi","Köpek","Balık"]],
      ["What is the Turkish for 'fish'?","Balık",["Kedi","Kuş","Köpek"]],
      ["What is the Turkish for 'rabbit'?","Tavşan",["Kedi","Köpek","At"]],
      ["What is the Turkish for 'duck'?","Ördek",["Kedi","Köpek","Kuş"]],
      ["What is the Turkish for 'elephant'?","Fil",["Aslan","Kaplan","Zürafa"]],
      ["What is the Turkish for 'lion'?","Aslan",["Fil","Kaplan","Zürafa"]],
      ["Which animal is the biggest?","Elephant",["Cat","Dog","Bird"]],
      ["Which animal is the fastest on land?","Cheetah",["Lion","Horse","Dog"]],
      ["What does a butterfly start as?","Caterpillar",["Egg only","Fly","Baby butterfly"]],
      ["What do bees make?","Honey",["Milk","Butter","Cheese"]],
    ],
    5: [
      ["What is the Turkish for 'mother'?","Anne",["Baba","Kardeş","Dede"]],
      ["What is the Turkish for 'father'?","Baba",["Anne","Kardeş","Dede"]],
      ["What is the Turkish for 'sister'?","Kız kardeş",["Erkek kardeş","Anne","Baba"]],
      ["What is the Turkish for 'brother'?","Erkek kardeş",["Kız kardeş","Anne","Baba"]],
      ["What is the Turkish for 'grandmother'?","Büyükanne / Nine",["Büyükbaba","Teyze","Hala"]],
      ["What is the Turkish for 'grandfather'?","Büyükbaba / Dede",["Büyükanne","Amca","Dayı"]],
      ["What is 'family' in Turkish?","Aile",["Ev","Okul","Arkadaş"]],
      ["What is 'baby' in Turkish?","Bebek",["Çocuk","Genç","Yaşlı"]],
      ["How many people are in a typical family?","It can vary",["Always 4","Always 3","Always 5"]],
      ["What is 'aunt' (mother's sister) in Turkish?","Teyze",["Hala","Anne","Dede"]],
      ["What is 'uncle' (father's brother) in Turkish?","Amca",["Dayı","Dede","Abi"]],
      ["What is 'cousin' in Turkish?","Kuzen",["Kardeş","Arkadaş","Komşu"]],
      ["My mother's mother is my...","Grandmother",["Grandfather","Aunt","Sister"]],
      ["My father's brother is my...","Uncle",["Aunt","Cousin","Brother"]],
      ["I love my family. What does 'love' mean?","Sevmek / Sevgi",["Nefret etmek","Ağlamak","Koşmak"]],
      ["What do families do together?","Eat, play, talk",["Only sleep","Only watch TV","Only work"]],
      ["'Home' in Turkish means?","Ev",["Okul","İş yeri","Park"]],
      ["What is 'parents' in Turkish?","Ebeveynler / Anne-baba",["Kardeşler","Arkadaşlar","Öğretmenler"]],
      ["'Children' in Turkish means?","Çocuklar",["Büyükler","Yaşlılar","Öğretmenler"]],
      ["What is 'happy family' in Turkish?","Mutlu aile",["Üzgün aile","Sinirli aile","Meşgul aile"]],
    ],
    6: [
      ["What is a 'pencil' in Turkish?","Kalem",["Silgi","Defter","Kitap"]],
      ["What is an 'eraser' in Turkish?","Silgi",["Kalem","Defter","Kitap"]],
      ["What is a 'book' in Turkish?","Kitap",["Kalem","Silgi","Defter"]],
      ["What is a 'notebook' in Turkish?","Defter",["Kalem","Silgi","Kitap"]],
      ["What is a 'bag' in Turkish?","Çanta",["Kalem","Defter","Kitap"]],
      ["What is a 'ruler' in Turkish?","Cetvel",["Kalem","Silgi","Makas"]],
      ["What is a 'scissors' in Turkish?","Makas",["Cetvel","Kalem","Silgi"]],
      ["What is a 'table' in Turkish?","Masa",["Sandalye","Koltuk","Raf"]],
      ["What is a 'chair' in Turkish?","Sandalye",["Masa","Koltuk","Raf"]],
      ["What is a 'board' (blackboard) in Turkish?","Tahta",["Kağıt","Kalem","Silgi"]],
      ["What is 'school' in Turkish?","Okul",["Ev","İş","Park"]],
      ["What is 'classroom' in Turkish?","Sınıf",["Okul","Kütüphane","Laboratuvar"]],
      ["What is 'teacher' in Turkish?","Öğretmen",["Müdür","Doktor","Polis"]],
      ["What is 'student' in Turkish?","Öğrenci",["Öğretmen","Müdür","Polis"]],
      ["What do you use to write?","Pencil / pen",["Eraser","Ruler","Bag"]],
      ["What do you use to erase?","Eraser",["Pencil","Ruler","Scissors"]],
      ["What do you read in school?","Book",["Eraser","Ruler","Scissors"]],
      ["What do you put your books in?","Bag",["Table","Chair","Board"]],
      ["What is 'homework' in Turkish?","Ödev",["Test","Sınav","Ders"]],
      ["Where do you study?","At school and at home",["Only at school","Only at home","At the park"]],
    ],
    7: [
      ["What is 'head' in Turkish?","Baş",["Ayak","El","Göz"]],
      ["What is 'eye' in Turkish?","Göz",["Kulak","Burun","Ağız"]],
      ["What is 'ear' in Turkish?","Kulak",["Göz","Burun","Ağız"]],
      ["What is 'nose' in Turkish?","Burun",["Göz","Kulak","Ağız"]],
      ["What is 'mouth' in Turkish?","Ağız",["Burun","Kulak","Göz"]],
      ["What is 'hand' in Turkish?","El",["Ayak","Baş","Göz"]],
      ["What is 'foot' in Turkish?","Ayak",["El","Baş","Göz"]],
      ["What is 'arm' in Turkish?","Kol",["Bacak","Baş","Göz"]],
      ["What is 'leg' in Turkish?","Bacak",["Kol","Baş","Göz"]],
      ["What is 'hair' in Turkish?","Saç",["Göz","Kulak","Burun"]],
      ["How many eyes do we have?","2",["1","3","4"]],
      ["How many ears do we have?","2",["1","3","4"]],
      ["How many fingers do we have (on two hands)?","10",["5","8","12"]],
      ["What do we use to see?","Eyes",["Ears","Nose","Mouth"]],
      ["What do we use to hear?","Ears",["Eyes","Nose","Mouth"]],
      ["What do we use to smell?","Nose",["Eyes","Ears","Mouth"]],
      ["What do we use to eat?","Mouth",["Eyes","Ears","Nose"]],
      ["What is 'tooth' in Turkish?","Diş",["Göz","Kulak","Burun"]],
      ["What is 'stomach' in Turkish?","Mide/Karın",["Baş","El","Ayak"]],
      ["What body part helps us think?","Brain (Beyin)",["Stomach","Hand","Foot"]],
    ],
    8: [
      ["What is 'apple' in Turkish?","Elma",["Armut","Muz","Portakal"]],
      ["What is 'banana' in Turkish?","Muz",["Elma","Armut","Portakal"]],
      ["What is 'orange' in Turkish?","Portakal",["Elma","Muz","Armut"]],
      ["What is 'bread' in Turkish?","Ekmek",["Süt","Peynir","Yumurta"]],
      ["What is 'milk' in Turkish?","Süt",["Ekmek","Peynir","Yumurta"]],
      ["What is 'egg' in Turkish?","Yumurta",["Ekmek","Süt","Peynir"]],
      ["What is 'water' in Turkish?","Su",["Süt","Meyve suyu","Çay"]],
      ["What is 'juice' in Turkish?","Meyve suyu",["Su","Süt","Çay"]],
      ["What is 'rice' in Turkish?","Pirinç",["Ekmek","Et","Balık"]],
      ["What is 'chicken' in Turkish?","Tavuk",["Et","Balık","Pirinç"]],
      ["What is 'fish' (food) in Turkish?","Balık",["Tavuk","Et","Pirinç"]],
      ["What is 'salad' in Turkish?","Salata",["Çorba","Tatlı","Meyve"]],
      ["What is 'soup' in Turkish?","Çorba",["Salata","Tatlı","Meyve"]],
      ["Which is a fruit?","Apple",["Bread","Milk","Rice"]],
      ["Which is a vegetable?","Carrot",["Apple","Banana","Orange"]],
      ["What is 'carrot' in Turkish?","Havuç",["Patates","Soğan","Domates"]],
      ["What is 'potato' in Turkish?","Patates",["Havuç","Soğan","Domates"]],
      ["What is 'tomato' in Turkish?","Domates",["Havuç","Patates","Soğan"]],
      ["What is a healthy snack?","Apple",["Chips","Candy","Soda"]],
      ["How many meals a day?","Three",["One","Two","Five"]],
    ],
    9: [
      ["What is 'Monday' in Turkish?","Pazartesi",["Salı","Çarşamba","Perşembe"]],
      ["What is 'Tuesday' in Turkish?","Salı",["Pazartesi","Çarşamba","Perşembe"]],
      ["What is 'Wednesday' in Turkish?","Çarşamba",["Pazartesi","Salı","Perşembe"]],
      ["What is 'Thursday' in Turkish?","Perşembe",["Pazartesi","Çarşamba","Cuma"]],
      ["What is 'Friday' in Turkish?","Cuma",["Pazartesi","Perşembe","Cumartesi"]],
      ["What is 'Saturday' in Turkish?","Cumartesi",["Cuma","Pazar","Pazartesi"]],
      ["What is 'Sunday' in Turkish?","Pazar",["Cumartesi","Cuma","Pazartesi"]],
      ["What is 'January' in Turkish?","Ocak",["Şubat","Mart","Nisan"]],
      ["What is 'February' in Turkish?","Şubat",["Ocak","Mart","Nisan"]],
      ["What is 'March' in Turkish?","Mart",["Ocak","Şubat","Nisan"]],
      ["What is 'June' in Turkish?","Haziran",["Nisan","Mayıs","Temmuz"]],
      ["What is 'December' in Turkish?","Aralık",["Kasım","Ekim","Ocak"]],
      ["What is 'spring' in Turkish?","İlkbahar",["Yaz","Sonbahar","Kış"]],
      ["What is 'summer' in Turkish?","Yaz",["İlkbahar","Sonbahar","Kış"]],
      ["What is 'autumn/fall' in Turkish?","Sonbahar",["İlkbahar","Yaz","Kış"]],
      ["What is 'winter' in Turkish?","Kış",["İlkbahar","Yaz","Sonbahar"]],
      ["How many days are in a week?","7",["5","6","8"]],
      ["How many months are in a year?","12",["10","11","13"]],
      ["Which month comes after March?","April",["February","May","June"]],
      ["Which season is the hottest?","Summer",["Spring","Autumn","Winter"]],
    ],
    10: [
      ["How do you say 'I am happy' in English?","I am happy",["I is happy","Me happy","Happy I am"]],
      ["How do you say 'I like cats' in English?","I like cats",["I likes cats","Me like cats","Cats I like"]],
      ["What does 'I go to school' mean?","Okula gidiyorum",["Eve gidiyorum","Markete gidiyorum","Parka gidiyorum"]],
      ["What does 'She is my friend' mean?","O benim arkadaşım",["O benim annem","O benim öğretmenim","O benim komşum"]],
      ["What does 'We play football' mean?","Futbol oynuyoruz",["Futbol izliyoruz","Futbol seviyoruz","Futbol alıyoruz"]],
      ["What does 'The book is on the table' mean?","Kitap masanın üstünde",["Kitap masanın altında","Kitap sandalyede","Kitap çantada"]],
      ["How do you say 'I eat an apple' in English?","I eat an apple",["I drink an apple","I like apple","I see an apple"]],
      ["What does 'My name is Elanaz' mean?","Benim adım Elanaz",["Benim arkadaşım Elanaz","Benim öğretmenim Elanaz","Benim annem Elanaz"]],
      ["What does 'I have two cats' mean?","İki kedim var",["İki kedim yok","İki kedi var","İki kedi istiyorum"]],
      ["How do you ask 'Where is the cat?' in English?","Where is the cat?",["Who is the cat?","What is the cat?","When is the cat?"]],
      ["What does 'This is a big red ball' mean?","Bu büyük kırmızı bir top",["Bu küçük mavi bir top","Bu büyük yeşil bir top","Bu küçük kırmızı bir top"]],
      ["How do you say 'I love my family'?","I love my family",["I like my family","I see my family","I have my family"]],
      ["What does 'She has a yellow pencil' mean?","Onun sarı bir kalemi var",["Onun mavi bir kalemi var","Onun sarı bir silgisi var","Onun sarı bir kitabı var"]],
      ["What does 'Do you have a pet?' mean?","Evcil hayvanın var mı?",["Ailenin var mı?","Arkadaşın var mı?","Kardeşin var mı?"]],
      ["'I can swim' means what in Turkish?","Yüzebilirim",["Koşabilirim","Uçabilirim","Zıplayabilirim"]],
      ["'She cannot fly' means what in Turkish?","O uçamaz",["O yüzemez","O koşamaz","O zıplayamaz"]],
      ["What does 'They are playing' mean?","Onlar oynuyor",["Onlar uyuyor","Onlar çalışıyor","Onlar yiyor"]],
      ["How do you say 'I want water please'?","I want water please",["I need water","Bring water","Water!"]],
      ["What is the correct sentence?","The cat is black.",["Cat the is black.","Black cat is the.","Is cat the black."]],
      ["What does 'good' mean in Turkish?","İyi",["Kötü","Büyük","Küçük"]],
    ],
  };
  const pool = all[tema] || all[1];
  return pool.map(([t,a,...w]) => {
    const wrongs = (w.length === 1 && Array.isArray(w[0])) ? w[0] : w;
    return q(S,T,t,a,wrongs);
  }).slice(0, 100);
}

// ================================================================
// MAIN — Generate all files
// ================================================================

console.log('\n🎓 Elanaz\'ın Ders Dünyası — Soru Üretici Başlıyor...\n');

// Math
for (let t = 1; t <= 10; t++) {
  const fns = [null, mathTema1, mathTema2, mathTema3, mathTema4, mathTema5,
    mathTema6, mathTema7, mathTema8, mathTema9, mathTema10];
  const questions = fns[t]();
  save('math', `tema${t}.json`, questions);
}

// Turkish
for (let t = 1; t <= 10; t++) {
  save('turkce', `tema${t}.json`, turkceTema(t));
}

// Science
for (let t = 1; t <= 10; t++) {
  save('fen', `tema${t}.json`, fenTema(t));
}

// Hayat Bilgisi
for (let t = 1; t <= 10; t++) {
  save('hayat', `tema${t}.json`, hayatTema(t));
}

// English
for (let t = 1; t <= 10; t++) {
  save('english', `tema${t}.json`, englishTema(t));
}

// Summary
console.log('\n✅ Tüm sorular oluşturuldu!');
