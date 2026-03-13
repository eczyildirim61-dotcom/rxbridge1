import { useState, useRef } from "react";

const MOCK_HASTANELER = [
  { id: "h1", ad: "KTÜ Farabi Hastanesi" },
  { id: "h2", ad: "Kanuni EAH (Kaşüstü Kampüsü)" },
  { id: "h3", ad: "Kanuni EAH (Numune Kampüsü)" },
  { id: "h4", ad: "Ahi Evren Göğüs Kalp ve Damar Cerrahisi EAH" },
  { id: "h5", ad: "Fatih Devlet Hastanesi" },
  { id: "h6", ad: "Yavuz Selim Kemik Hastalıkları ve Rehabilitasyon Hastanesi" },
  { id: "h7", ad: "Medical Park Karadeniz Hastanesi" },
  { id: "h8", ad: "Özel İmperial Hastanesi" },
  { id: "h9", ad: "Özel 7M Hastanesi" },
  { id: "h10", ad: "Akçaabat Devlet Hastanesi" },
  { id: "h11", ad: "Of Devlet Hastanesi" },
  { id: "h12", ad: "Araklı Bayram Halil Devlet Hastanesi" },
];

const MOCK_DOKTORLAR = [
  { id: "d1", ad: "Dr. Ahmet Yılmaz", uzmanlik: "Dahiliye (İç Hastalıkları)", hastaneId: "h1", hastane: "KTÜ Farabi Hastanesi", diplomaNo: "TR-12345" },
  { id: "d2", ad: "Dr. Elif Şahin", uzmanlik: "Kardiyoloji", hastaneId: "h2", hastane: "Kanuni EAH (Kaşüstü Kampüsü)", diplomaNo: "TR-23456" },
  { id: "d3", ad: "Dr. Murat Demir", uzmanlik: "Romatoloji", hastaneId: "h5", hastane: "Fatih Devlet Hastanesi", diplomaNo: "TR-34567" },
  { id: "d4", ad: "Dr. Zeynep Koca", uzmanlik: "Endokrinoloji", hastaneId: "h1", hastane: "KTÜ Farabi Hastanesi", diplomaNo: "TR-45678" },
];

const MOCK_ECZACILAR = [
  { id: "e1", ad: "Ecz. Ayşe Kaya", eczane: "Güven Eczanesi", sifre: "1234" },
  { id: "e2", ad: "Ecz. Mehmet Demir", eczane: "Şifa Eczanesi", sifre: "1234" },
];

const MOCK_DOKTOR_HESAPLAR = [
  { id: "d1", sifre: "1234" },
  { id: "d2", sifre: "1234" },
];

const MOCK_SEKRETERLER = [
  { id: "s1", ad: "Selin Arslan", doktorId: "d1", sifre: "1234" },
  { id: "s2", ad: "Kemal Yıldız", doktorId: "d2", sifre: "1234" },
];

const BASLANGIC_TALEPLER = [
  { id: 1, eczaciId: "e1", doktorId: "d1", hasta: "A.Y. - 45 yaş", ilac: "Metformin 1000mg", hataTuru: "Tanı kodu eksik / hatalı", aciklama: "Tip 2 Diyabet tanısı reçetede eksik. SUT Madde 4.2.14 gereği ICD-10 E11 kodu gerekli.", durum: "beklemede", tarih: "05.03.2026 - 09:14", guncelleyen: null, hastaBekliyor: true, fotograflar: [], mesajlar: [{ id: "m1", yazar: "Dr. Ahmet Yılmaz", yazarRol: "doktor", icerik: "Hasta randevudan önce bu tanıyı kendisi söylemişti, sisteme girmeyi unuttum. Şimdi düzelttim.", tarih: "05.03.2026 - 09:22" }] },
  { id: 2, eczaciId: "e1", doktorId: "d3", hasta: "B.K. - 62 yaş", ilac: "Adalimumab 40mg", hataTuru: "Uzman raporu eksik", aciklama: "Biyolojik ilaç için romatoloji uzman raporu eksik. Ödeme onayı için gerekli.", durum: "düzeltildi", tarih: "04.03.2026 - 14:32", guncelleyen: null, hastaBekliyor: false, fotograflar: [], mesajlar: [] },
  { id: 3, eczaciId: "e2", doktorId: "d2", hasta: "C.A. - 38 yaş", ilac: "Lansoprazol 30mg", hataTuru: "Doz uyumsuzluğu", aciklama: "Reçetede doz 2x1 yazılmış ancak SUT onaylı dozu 1x1. Doz düzeltmesi gerekiyor.", durum: "reddedildi", tarih: "04.03.2026 - 11:05", guncelleyen: null, hastaBekliyor: false, fotograflar: [], mesajlar: [] },
];

const BASLANGIC_FORUM = [
  { id: "f1", kanal: "sut", baslik: "SUT Güncelleme — Mart 2026", icerik: "Biyolojik ilaçlar için uzman raporu zorunluluğu genişletildi. Madde 4.2.31 kapsamında yeni endikasyonlar eklendi.", yazar: "RxBridge Editör", yazarRol: "editor", tarih: "05.03.2026", yanitlar: [] },
  { id: "f2", kanal: "sut", baslik: "Diyabet İlaçları — Yeni Kota Düzenlemesi", icerik: "SGLT-2 inhibitörleri için aylık kutu sayısı kısıtlaması 01.03.2026 tarihinden itibaren geçerlidir.", yazar: "RxBridge Editör", yazarRol: "editor", tarih: "01.03.2026", yanitlar: [] },
  { id: "f3", kanal: "genel", baslik: "Platforma Hoş Geldiniz!", icerik: "RxBridge, eczacı ve doktorların reçete sorunlarını hızla çözebileceği bir iletişim platformudur.", yazar: "RxBridge Editör", yazarRol: "editor", tarih: "01.03.2026", yanitlar: [] },
  { id: "f4", kanal: "etken", baslik: "Metformin + Kontrast Madde Etkileşimi", icerik: "Hastama CT çekimi öncesi kontrast verilecek. Metformin kullanıyor. Kaç gün önce kesilmeli?", yazar: "Ecz. Ayşe Kaya", yazarRol: "eczaci", tarih: "04.03.2026", yanitlar: [{ id: "y1", icerik: "Genel kural olarak kontrast öncesi 48 saat, sonrasında da 48 saat kesilmesi önerilir.", yazar: "Dr. Ahmet Yılmaz", yazarRol: "doktor", tarih: "04.03.2026" }] },
  { id: "f5", kanal: "etken", baslik: "Varfarin dozunun reçetede belirtilmesi zorunlu mu?", icerik: "SUT'a göre varfarin için INR değerinin reçetede bulunması şart mı? Bazı doktorlar yazmıyor.", yazar: "Ecz. Mehmet Demir", yazarRol: "eczaci", tarih: "03.03.2026", yanitlar: [] },
];

const UZMANLIK_ALANLARI = [
  "Aile Hekimliği", "Acil Tıp", "Anesteziyoloji", "Beyin ve Sinir Cerrahisi",
  "Çocuk Hastalıkları (Pediatri)", "Çocuk Cerrahisi", "Dahiliye (İç Hastalıkları)",
  "Dermatoloji", "Endokrinoloji", "Enfeksiyon Hastalıkları", "Fizik Tedavi ve Rehabilitasyon",
  "Gastroenteroloji", "Genel Cerrahi", "Göğüs Hastalıkları", "Göğüs Cerrahisi",
  "Göz Hastalıkları (Oftalmoloji)", "Hematoloji", "Kadın Hastalıkları ve Doğum",
  "Kardiyoloji", "Kalp ve Damar Cerrahisi", "Kulak Burun Boğaz (KBB)",
  "Nefroloji", "Nöroloji", "Nöroşirürji", "Onkoloji", "Ortopedi ve Travmatoloji",
  "Psikiyatri", "Radyoloji", "Romatoloji", "Üroloji", "Diğer",
];

const HATA_TURLERI = ["Tanı kodu eksik / hatalı", "Uzman raporu eksik", "Doz uyumsuzluğu", "Endikasyon dışı kullanım", "Reçete süresi aşıldı", "Diğer"];

const ST = {
  beklemede: { label: "Beklemede", color: "#F59E0B", bg: "#FEF3C7", dot: "#F59E0B" },
  düzeltildi: { label: "Düzeltildi", color: "#10B981", bg: "#D1FAE5", dot: "#10B981" },
  reddedildi: { label: "Reddedildi", color: "#EF4444", bg: "#FEE2E2", dot: "#EF4444" },
};

const ROL_RENK = {
  editor: { bg: "#EDE9FE", color: "#7C3AED", label: "Editör" },
  doktor: { bg: "#D1FAE5", color: "#065F46", label: "🩺 Doktor" },
  eczaci: { bg: "#DBEAFE", color: "#1E40AF", label: "⚗️ Eczacı" },
  sekreter: { bg: "#FEF3C7", color: "#92400E", label: "📋 Sekreter" },
};

function Fg({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12, textAlign: "left" }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
      {children}
    </div>
  );
}

function Fga({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
      {children}
    </div>
  );
}

// Fotoğraf önizleme modalı
function FotoModal({ src, onKapat }) {
  if (!src) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onKapat}>
      <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
        <img src={src} alt="Reçete" style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: 12, objectFit: "contain" }} />
        <button onClick={onKapat} style={{ position: "absolute", top: -14, right: -14, background: "#fff", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontWeight: 700, fontSize: 16, color: "#0F172A" }}>✕</button>
      </div>
    </div>
  );
}

export default function App() {
  const [ekran, setEkran] = useState("giris");
  const [rol, setRol] = useState(null);
  const [aktif, setAktif] = useState(null);
  const [eczacilar, setEczacilar] = useState(MOCK_ECZACILAR);
  const [doktorlar, setDoktorlar] = useState(MOCK_DOKTORLAR);
  const [doktorHesaplar, setDoktorHesaplar] = useState(MOCK_DOKTOR_HESAPLAR);
  const [sekreterler, setSekreterler] = useState(MOCK_SEKRETERLER);
  const [aktifSekme, setAktifSekme] = useState("talepler");
  const [talepler, setTalepler] = useState(BASLANGIC_TALEPLER);
  const [secilen, setSecilen] = useState(null);
  const [modalAcik, setModalAcik] = useState(false);
  const [hata, setHata] = useState("");
  const [gonderildi, setGonderildi] = useState(false);
  const [girisForm, setGirisForm] = useState({ id: "", sifre: "" });
  const [kayitForm, setKayitForm] = useState({ ad: "", eczane: "", telefon: "", hastaneId: "", uzmanlik: "", diplomaNo: "", doktorId: "", sifre: "", sifre2: "" });
  const [talepForm, setTalepForm] = useState({ hasta: "", ilac: "", hastaneId: "", uzmanlik: "", doktorId: "", hataTuru: "", aciklama: "", hastaBekliyor: false });
  const [talepFotograflar, setTalepFotograflar] = useState([]); // base64 fotoğraflar
  const [durumFiltre, setDurumFiltre] = useState("tümü");
  const [forumGonderiler, setForumGonderiler] = useState(BASLANGIC_FORUM);
  const [aktifKanal, setAktifKanal] = useState("genel");
  const [secilenGonderi, setSecilenGonderi] = useState(null);
  const [yeniGonderiAcik, setYeniGonderiAcik] = useState(false);
  const [yanitForm, setYanitForm] = useState("");
  const [gonderiForm, setGonderiForm] = useState({ baslik: "", icerik: "", kanal: "genel" });
  const [buyukFoto, setBuyukFoto] = useState(null);
  const fileInputRef = useRef(null);

  const rolSec = (r) => { setRol(r); setEkran("giris_form"); setHata(""); setGirisForm({ id: "", sifre: "" }); };
  const cikis = () => { setEkran("giris"); setRol(null); setAktif(null); setSecilen(null); setAktifSekme("talepler"); };

  const girisYap = () => {
    setHata("");
    if (rol === "eczaci") {
      const k = eczacilar.find(e => e.id === girisForm.id && e.sifre === girisForm.sifre);
      if (k) { setAktif(k); setEkran("panel"); } else setHata("Şifre hatalı.");
    } else if (rol === "doktor") {
      const h = doktorHesaplar.find(h => h.id === girisForm.id && h.sifre === girisForm.sifre);
      if (h) { setAktif(doktorlar.find(d => d.id === h.id)); setEkran("panel"); } else setHata("Şifre hatalı.");
    } else {
      const s = sekreterler.find(s => s.id === girisForm.id && s.sifre === girisForm.sifre);
      if (s) { setAktif(s); setEkran("panel"); } else setHata("Şifre hatalı.");
    }
  };

  const kayitOl = () => {
    setHata("");
    if (!kayitForm.ad || !kayitForm.sifre) return setHata("Zorunlu alanları doldurun.");
    if (rol === "doktor" && !kayitForm.diplomaNo) return setHata("Diploma tescil numarası zorunludur.");
    if (rol === "doktor" && !kayitForm.hastaneId) return setHata("Lütfen çalıştığınız hastaneyi seçin.");
    if (kayitForm.sifre !== kayitForm.sifre2) return setHata("Şifreler eşleşmiyor.");

    // Yeni kullanıcıyı oluştur ve direkt giriş yaptır
    const yeniId = "yeni_" + Date.now();
    if (rol === "eczaci") {
      const yeni = { id: yeniId, ad: kayitForm.ad, eczane: kayitForm.eczane || "Eczanem", sifre: kayitForm.sifre };
      setEczacilar(prev => [...prev, yeni]);
      setAktif(yeni);
    } else if (rol === "doktor") {
      const hastane = MOCK_HASTANELER.find(h => h.id === kayitForm.hastaneId);
      const yeni = { id: yeniId, ad: kayitForm.ad, uzmanlik: kayitForm.uzmanlik || "Genel", hastaneId: kayitForm.hastaneId, hastane: hastane?.ad || "", diplomaNo: kayitForm.diplomaNo };
      setDoktorlar(prev => [...prev, yeni]);
      setDoktorHesaplar(prev => [...prev, { id: yeniId, sifre: kayitForm.sifre }]);
      setAktif(yeni);
    } else {
      const yeni = { id: yeniId, ad: kayitForm.ad, doktorId: kayitForm.doktorId, sifre: kayitForm.sifre };
      setSekreterler(prev => [...prev, yeni]);
      setAktif(yeni);
    }
    setEkran("panel");
  };

  // Fotoğraf seçme — FileReader ile base64'e çevir
  const fotografSec = (e) => {
    const dosyalar = Array.from(e.target.files);
    dosyalar.forEach(dosya => {
      if (dosya.size > 5 * 1024 * 1024) { alert("Fotoğraf 5MB'dan küçük olmalı."); return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setTalepFotograflar(prev => [...prev, { id: Date.now() + Math.random(), src: ev.target.result, ad: dosya.name }]);
      };
      reader.readAsDataURL(dosya);
    });
    e.target.value = "";
  };

  const fotografKaldir = (id) => setTalepFotograflar(prev => prev.filter(f => f.id !== id));

  const talepGonder = () => {
    if (!talepForm.hasta || !talepForm.ilac || !talepForm.doktorId || !talepForm.aciklama) return;
    setTalepler([{
      id: Date.now(), eczaciId: aktif.id, doktorId: talepForm.doktorId,
      hasta: talepForm.hasta, ilac: talepForm.ilac, hataTuru: talepForm.hataTuru,
      aciklama: talepForm.aciklama, durum: "beklemede",
      tarih: new Date().toLocaleString("tr-TR"), guncelleyen: null,
      hastaBekliyor: talepForm.hastaBekliyor,
      fotograflar: talepFotograflar,
      mesajlar: []
    }, ...talepler]);
    setGonderildi(true);
    setTimeout(() => {
      setGonderildi(false); setModalAcik(false);
      setTalepForm({ hasta: "", ilac: "", hastaneId: "", uzmanlik: "", doktorId: "", hataTuru: "", aciklama: "", hastaBekliyor: false });
      setTalepFotograflar([]);
    }, 2000);
  };

  const durumGuncelle = (id, yeniDurum) => {
    const guncelleyen = rol === "sekreter" ? `${aktif.ad} (Sekreter)` : aktif?.ad;
    setTalepler(talepler.map(t => t.id === id ? { ...t, durum: yeniDurum, guncelleyen } : t));
    setSecilen(prev => prev?.id === id ? { ...prev, durum: yeniDurum, guncelleyen } : prev);
  };

  const mesajGonder = (talepId, icerik) => {
    if (!icerik.trim()) return;
    const yeniMesaj = { id: Date.now().toString(), yazar: aktif.ad, yazarRol: rol, icerik, tarih: new Date().toLocaleString("tr-TR") };
    const guncellenmis = talepler.map(t => t.id === talepId ? { ...t, mesajlar: [...(t.mesajlar || []), yeniMesaj] } : t);
    setTalepler(guncellenmis);
    setSecilen(guncellenmis.find(t => t.id === talepId));
  };

  const yanitGonder = (gonderiId) => {
    if (!yanitForm.trim()) return;
    const yeniYanit = { id: Date.now().toString(), icerik: yanitForm, yazar: aktif.ad, yazarRol: rol, tarih: new Date().toLocaleDateString("tr-TR") };
    const guncellenmis = forumGonderiler.map(g => g.id === gonderiId ? { ...g, yanitlar: [...g.yanitlar, yeniYanit] } : g);
    setForumGonderiler(guncellenmis);
    setSecilenGonderi(guncellenmis.find(g => g.id === gonderiId));
    setYanitForm("");
  };

  const gonderiEkle = () => {
    if (!gonderiForm.baslik.trim() || !gonderiForm.icerik.trim()) return;
    const yeni = { id: Date.now().toString(), kanal: gonderiForm.kanal, baslik: gonderiForm.baslik, icerik: gonderiForm.icerik, yazar: aktif.ad, yazarRol: rol, tarih: new Date().toLocaleDateString("tr-TR"), yanitlar: [] };
    setForumGonderiler([yeni, ...forumGonderiler]);
    setAktifKanal(gonderiForm.kanal);
    setSecilenGonderi(yeni);
    setYeniGonderiAcik(false);
    setGonderiForm({ baslik: "", icerik: "", kanal: "genel" });
  };

  const kanalErisim = (kanal) => kanal === "etken" ? (rol === "eczaci" || rol === "doktor") : true;
  const gorunenDoktorId = rol === "sekreter" ? aktif?.doktorId : aktif?.id;
  const tumGorunen = ekran === "panel" ? (rol === "eczaci" ? talepler.filter(t => t.eczaciId === aktif?.id) : talepler.filter(t => t.doktorId === gorunenDoktorId)) : [];
  const gorunen = durumFiltre === "tümü" ? tumGorunen : tumGorunen.filter(t => t.durum === durumFiltre);
  const bekleyen = tumGorunen.filter(t => t.durum === "beklemede").length;

  if (ekran === "giris") return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.logoRow}><span style={s.rx}>Rx</span><span style={s.br}>Bridge</span></div>
        <p style={s.logoAlt}>Reçete İletişim Platformu</p>
        <div style={s.ayrac} />
        <p style={s.aciklama}>Devam etmek için rolünüzü seçin</p>
        <div style={s.rolRow}>
          {[["eczaci","⚗️","Eczacı","Reçete bildirimi gönder","rgba(56,189,248,0.4)"],["doktor","🩺","Doktor","Bildirimleri görüntüle","rgba(52,211,153,0.4)"],["sekreter","📋","Sekreter","Doktor adına işlem yap","rgba(251,191,36,0.4)"]].map(([r,ikon,label,alt,bc]) => (
            <button key={r} style={{ ...s.rolBtn, borderColor: bc }} onClick={() => rolSec(r)}>
              <span style={{ fontSize: 28 }}>{ikon}</span>
              <span style={s.rolLabel}>{label}</span>
              <span style={s.rolAlt}>{alt}</span>
            </button>
          ))}
        </div>
        <p style={s.not}>Bu bir prototip gösterimidir.</p>
      </div>
    </div>
  );

  if (ekran === "giris_form") {
    const liste = rol === "eczaci" ? eczacilar : rol === "doktor" ? doktorlar : sekreterler;
    return (
      <div style={s.wrap}>
        <div style={s.card}>
          <div style={s.logoRow}><span style={s.rx}>Rx</span><span style={s.br}>Bridge</span></div>
          <div style={s.ayrac} />
          <h3 style={s.fBaslik}>{rol === "eczaci" ? "⚗️ Eczacı Girişi" : rol === "doktor" ? "🩺 Doktor Girişi" : "📋 Sekreter Girişi"}</h3>
          <Fg label="Ad Soyad">
            <select style={s.inp} value={girisForm.id} onChange={e => setGirisForm({ ...girisForm, id: e.target.value })}>
              <option value="">Seçiniz...</option>
              {liste.map(k => <option key={k.id} value={k.id}>{k.ad}</option>)}
            </select>
          </Fg>
          <Fg label="Şifre">
            <input style={s.inp} type="password" placeholder="Şifreniz" value={girisForm.sifre} onChange={e => setGirisForm({ ...girisForm, sifre: e.target.value })} onKeyDown={e => e.key === "Enter" && girisYap()} />
          </Fg>
          {hata && <p style={s.hata}>{hata}</p>}
          <button style={s.submit} onClick={girisYap}>Giriş Yap</button>
          <div style={s.kayitRow}>
            <span style={s.kayitMetin}>Hesabınız yok mu?</span>
            <button style={s.kayitLink} onClick={() => { setEkran("kayit"); setHata(""); }}>Üye Ol</button>
          </div>
          <button style={s.geri} onClick={() => setEkran("giris")}>← Geri</button>
        </div>
      </div>
    );
  }

  if (ekran === "kayit") return (
    <div style={s.wrap}>
      <div style={{ ...s.card, maxWidth: 460 }}>
        <div style={s.logoRow}><span style={s.rx}>Rx</span><span style={s.br}>Bridge</span></div>
        <div style={s.ayrac} />
        <h3 style={s.fBaslik}>{rol === "eczaci" ? "⚗️ Eczacı Kaydı" : rol === "doktor" ? "🩺 Doktor Kaydı" : "📋 Sekreter Kaydı"}</h3>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginBottom: 16 }}>Bilgileriniz doğrulandıktan sonra hesabınız aktif edilecektir.</p>
        <Fg label="Ad Soyad *">
          <input style={s.inp} placeholder={rol === "eczaci" ? "Ecz. Ad Soyad" : rol === "doktor" ? "Dr. Ad Soyad" : "Ad Soyad"} value={kayitForm.ad} onChange={e => setKayitForm({ ...kayitForm, ad: e.target.value })} />
        </Fg>
        {rol === "eczaci" && (
          <>
            <Fg label="Eczane Adı *">
              <input style={s.inp} placeholder="Eczane adınız" value={kayitForm.eczane} onChange={e => setKayitForm({ ...kayitForm, eczane: e.target.value })} />
            </Fg>
            <Fg label="Eczane Telefonu">
              <input style={s.inp} placeholder="0462 123 45 67" value={kayitForm.telefon} onChange={e => setKayitForm({ ...kayitForm, telefon: e.target.value })} />
            </Fg>
          </>
        )}
        {rol === "doktor" && (
          <>
            <Fg label="Hastane *">
              <select style={s.inp} value={kayitForm.hastaneId} onChange={e => setKayitForm({ ...kayitForm, hastaneId: e.target.value })}>
                <option value="">Hastane seçiniz...</option>
                {MOCK_HASTANELER.map(h => <option key={h.id} value={h.id}>{h.ad}</option>)}
              </select>
            </Fg>
            <Fg label="Uzmanlık Alanı *">
              <select style={s.inp} value={kayitForm.uzmanlik} onChange={e => setKayitForm({ ...kayitForm, uzmanlik: e.target.value })}>
                <option value="">Branş seçiniz...</option>
                {UZMANLIK_ALANLARI.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </Fg>
            <Fg label="Diploma Tescil Numarası *">
              <input style={s.inp} placeholder="örn. TR-12345" value={kayitForm.diplomaNo} onChange={e => setKayitForm({ ...kayitForm, diplomaNo: e.target.value })} />
            </Fg>
          </>
        )}
        {rol === "sekreter" && (
          <>
            <Fg label="Hastane *">
              <select style={s.inp} value={kayitForm.hastaneId} onChange={e => setKayitForm({ ...kayitForm, hastaneId: e.target.value, uzmanlik: "", doktorId: "" })}>
                <option value="">Hastane seçiniz...</option>
                {MOCK_HASTANELER.map(h => <option key={h.id} value={h.id}>{h.ad}</option>)}
              </select>
            </Fg>
            <Fg label="Branş *">
              <select style={s.inp} value={kayitForm.uzmanlik} onChange={e => setKayitForm({ ...kayitForm, uzmanlik: e.target.value, doktorId: "" })} disabled={!kayitForm.hastaneId}>
                <option value="">{kayitForm.hastaneId ? "Branş seçiniz..." : "Önce hastane seçin"}</option>
                {[...new Set(doktorlar.filter(d => d.hastaneId === kayitForm.hastaneId).map(d => d.uzmanlik))].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </Fg>
            <Fg label="Bağlı Olduğunuz Doktor *">
              <select style={s.inp} value={kayitForm.doktorId} onChange={e => setKayitForm({ ...kayitForm, doktorId: e.target.value })} disabled={!kayitForm.uzmanlik}>
                <option value="">{kayitForm.uzmanlik ? "Doktor seçiniz..." : "Önce branş seçin"}</option>
                {doktorlar.filter(d => d.hastaneId === kayitForm.hastaneId && d.uzmanlik === kayitForm.uzmanlik).map(d => <option key={d.id} value={d.id}>{d.ad} — {d.uzmanlik}</option>)}
              </select>
            </Fg>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginBottom: 10 }}>Seçtiğiniz doktorun onayından sonra hesabınız aktif edilecektir.</p>
          </>
        )}
        <Fg label="Şifre *">
          <input style={s.inp} type="password" placeholder="En az 6 karakter" value={kayitForm.sifre} onChange={e => setKayitForm({ ...kayitForm, sifre: e.target.value })} />
        </Fg>
        <Fg label="Şifre Tekrar *">
          <input style={s.inp} type="password" placeholder="Şifrenizi tekrar girin" value={kayitForm.sifre2} onChange={e => setKayitForm({ ...kayitForm, sifre2: e.target.value })} />
        </Fg>
        {hata && <p style={s.hata}>{hata}</p>}
        <button style={s.submit} onClick={kayitOl}>Kayıt Ol</button>
        <button style={s.geri} onClick={() => { setEkran("giris_form"); setHata(""); }}>← Geri</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "sans-serif" }}>
      <FotoModal src={buyukFoto} onKapat={() => setBuyukFoto(null)} />

      <header style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            <span style={s.rx2}>Rx</span><span style={s.br2}>Bridge</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[["talepler","📋 Talepler"],["forum","💬 Forum"]].map(([sekme,label]) => (
              <button key={sekme} onClick={() => setAktifSekme(sekme)} style={{ background: aktifSekme === sekme ? "rgba(56,189,248,0.15)" : "transparent", border: aktifSekme === sekme ? "1px solid rgba(56,189,248,0.4)" : "1px solid transparent", color: aktifSekme === sekme ? "#38BDF8" : "rgba(255,255,255,0.5)", padding: "5px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: aktifSekme === sekme ? 600 : 400 }}>{label}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {aktifSekme === "talepler" && bekleyen > 0 && <span style={{ background: "#F59E0B", color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>{bekleyen} bekleyen bildirim</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{aktif?.ad}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{rol === "eczaci" ? aktif?.eczane : rol === "sekreter" ? `Sekreter — ${doktorlar.find(d => d.id === aktif?.doktorId)?.ad}` : aktif?.uzmanlik}</div>
          </div>
          <button style={s.cikisBtn} onClick={cikis}>Çıkış</button>
        </div>
      </header>

      <div style={{ display: "flex", height: "calc(100vh - 58px)" }}>
        {aktifSekme === "talepler" && (
          <>
            <div style={s.sol}>
              <div style={s.solBaslik}>
                <span>{rol === "eczaci" ? "Taleplerim" : rol === "sekreter" ? "Doktorun Bildirimleri" : "Gelen Bildirimler"}<span style={s.sayac}>{gorunen.length}</span></span>
                {rol === "eczaci" && <button style={s.yeniBtn} onClick={() => setModalAcik(true)}>+ Yeni Talep</button>}
              </div>
              {/* DURUM FİLTRESİ */}
              <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9", background: "#FAFAFA" }}>
                {[["tümü","Tümü", tumGorunen.length], ["beklemede","Beklemede", tumGorunen.filter(t=>t.durum==="beklemede").length], ["düzeltildi","Düzeltildi", tumGorunen.filter(t=>t.durum==="düzeltildi").length], ["reddedildi","Reddedildi", tumGorunen.filter(t=>t.durum==="reddedildi").length]].map(([val, lbl, cnt]) => (
                  <button key={val} onClick={() => setDurumFiltre(val)} style={{ flex: 1, padding: "8px 4px", border: "none", borderBottom: durumFiltre === val ? "2px solid #38BDF8" : "2px solid transparent", background: "transparent", cursor: "pointer", fontSize: 10, fontWeight: durumFiltre === val ? 700 : 400, color: durumFiltre === val ? "#0F172A" : "#94A3B8" }}>
                    {lbl}<br/><span style={{ fontSize: 12, fontWeight: 700, color: durumFiltre === val ? "#38BDF8" : "#CBD5E1" }}>{cnt}</span>
                  </button>
                ))}
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {gorunen.length === 0 ? (
                  <div style={s.bosL}><span style={{ fontSize: 32 }}>📋</span><p>{rol === "eczaci" ? "Henüz talep oluşturmadınız." : "Bekleyen bildirim yok."}</p></div>
                ) : gorunen.map(t => {
                  const st = ST[t.durum];
                  const doktor = doktorlar.find(d => d.id === t.doktorId);
                  return (
                    <div key={t.id} style={{ ...s.talepK, ...(secilen?.id === t.id ? s.talepKS : {}) }} onClick={() => setSecilen(t)}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: "#0F172A" }}>{t.ilac}</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot, display: "inline-block" }} />{st.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#475569", marginBottom: 5 }}>{t.hasta}</div>
                      {t.hastaBekliyor && <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#FEF3C7", color: "#92400E", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, marginBottom: 5 }}>⏳ Hasta eczanede bekliyor</div>}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#94A3B8" }}>
                        <span>{doktor?.ad || "—"}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {t.fotograflar?.length > 0 && <span style={{ fontSize: 11 }}>📎 {t.fotograflar.length}</span>}
                          <span>{t.tarih}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 32, background: "#F8FAFC" }}>
              {secilen ? <DetayPanel t={secilen} rol={rol} aktif={aktif} doktor={doktorlar.find(d => d.id === secilen.doktorId)} onGuncelle={durumGuncelle} onMesaj={mesajGonder} onFotoBuyut={setBuyukFoto} /> : (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  <span style={{ fontSize: 48 }}>📋</span>
                  <p style={{ color: "#94A3B8", fontSize: 14, textAlign: "center", lineHeight: 1.6 }}>Detayları görüntülemek için<br />sol listeden bir talep seçin</p>
                </div>
              )}
            </div>
          </>
        )}

        {aktifSekme === "forum" && (
          <>
            <div style={{ width: 210, borderRight: "1px solid #E2E8F0", background: "#fff", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "14px 16px", fontWeight: 700, fontSize: 13, color: "#0F172A", borderBottom: "1px solid #F1F5F9" }}>Kanallar</div>
              {[{ id: "genel", ikon: "📢", label: "Genel Duyurular" }, { id: "sut", ikon: "📄", label: "SUT Duyuruları" }, { id: "etken", ikon: "💊", label: "Etken Madde Danışma" }].map(k => {
                const erisim = kanalErisim(k.id);
                return (
                  <div key={k.id} onClick={() => erisim && setAktifKanal(k.id)} style={{ padding: "11px 16px", cursor: erisim ? "pointer" : "not-allowed", background: aktifKanal === k.id ? "#F0F9FF" : "transparent", borderLeft: aktifKanal === k.id ? "3px solid #38BDF8" : "3px solid transparent", opacity: erisim ? 1 : 0.4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{k.ikon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: aktifKanal === k.id ? 600 : 400, color: "#0F172A" }}>{k.label}</div>
                        {!erisim && <div style={{ fontSize: 10, color: "#94A3B8" }}>Sadece eczacı/doktor</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
              {rol !== "sekreter" && (
                <div style={{ padding: "12px 16px", marginTop: "auto", borderTop: "1px solid #F1F5F9" }}>
                  <button onClick={() => setYeniGonderiAcik(true)} style={{ width: "100%", background: "#0F172A", color: "#fff", border: "none", padding: "8px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>+ Yeni Gönderi</button>
                </div>
              )}
            </div>
            <div style={{ width: 340, borderRight: "1px solid #E2E8F0", background: "#fff", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "14px 16px", fontWeight: 700, fontSize: 13, color: "#0F172A", borderBottom: "1px solid #F1F5F9" }}>
                {aktifKanal === "genel" ? "📢 Genel Duyurular" : aktifKanal === "sut" ? "📄 SUT Duyuruları" : "💊 Etken Madde Danışma"}
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {forumGonderiler.filter(g => g.kanal === aktifKanal).length === 0 ? (
                  <div style={s.bosL}><span style={{ fontSize: 32 }}>💬</span><p>Henüz gönderi yok.</p></div>
                ) : forumGonderiler.filter(g => g.kanal === aktifKanal).map(g => (
                  <div key={g.id} onClick={() => setSecilenGonderi(g)} style={{ padding: "14px 16px", borderBottom: "1px solid #F1F5F9", cursor: "pointer", background: secilenGonderi?.id === g.id ? "#F0F9FF" : "transparent", borderLeft: secilenGonderi?.id === g.id ? "3px solid #38BDF8" : "3px solid transparent" }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#0F172A", marginBottom: 4 }}>{g.baslik}</div>
                    <div style={{ fontSize: 11, color: "#475569", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.icerik}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94A3B8" }}>
                      <span>{g.yazar}</span><span>{g.yanitlar.length} yanıt · {g.tarih}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 28, background: "#F8FAFC" }}>
              {secilenGonderi ? (
                <div style={{ maxWidth: 640 }}>
                  <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #E2E8F0", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      {ROL_RENK[secilenGonderi.yazarRol] && <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: ROL_RENK[secilenGonderi.yazarRol].bg, color: ROL_RENK[secilenGonderi.yazarRol].color }}>{ROL_RENK[secilenGonderi.yazarRol].label}</span>}
                      <span style={{ fontSize: 12, color: "#64748B" }}>{secilenGonderi.yazar} · {secilenGonderi.tarih}</span>
                    </div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", margin: "0 0 12px" }}>{secilenGonderi.baslik}</h2>
                    <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, margin: 0 }}>{secilenGonderi.icerik}</p>
                  </div>
                  {secilenGonderi.yanitlar.map(y => (
                    <div key={y.id} style={{ background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #E2E8F0", marginBottom: 10, marginLeft: 24 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        {ROL_RENK[y.yazarRol] && <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: ROL_RENK[y.yazarRol].bg, color: ROL_RENK[y.yazarRol].color }}>{ROL_RENK[y.yazarRol].label}</span>}
                        <span style={{ fontSize: 11, color: "#94A3B8" }}>{y.yazar} · {y.tarih}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.65, margin: 0 }}>{y.icerik}</p>
                    </div>
                  ))}
                  {rol !== "sekreter" && (
                    <div style={{ background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #E2E8F0", marginTop: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8 }}>Yanıt Yaz</div>
                      <textarea style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid #E2E8F0", fontSize: 13, resize: "vertical", minHeight: 80, outline: "none", fontFamily: "sans-serif", boxSizing: "border-box" }} placeholder="Yanıtınızı yazın..." value={yanitForm} onChange={e => setYanitForm(e.target.value)} />
                      <button onClick={() => yanitGonder(secilenGonderi.id)} style={{ marginTop: 10, background: "#0F172A", color: "#fff", border: "none", padding: "9px 20px", borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Yanıtla →</button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  <span style={{ fontSize: 48 }}>💬</span>
                  <p style={{ color: "#94A3B8", fontSize: 14, textAlign: "center" }}>Bir gönderi seçin</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {modalAcik && (
        <div style={s.ov} onClick={() => setModalAcik(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: 0 }}>Yeni Reçete Talebi</h3>
              <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#94A3B8" }} onClick={() => setModalAcik(false)}>✕</button>
            </div>
            {gonderildi ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}><div style={{ fontSize: 48, color: "#10B981" }}>✓</div><p style={{ color: "#1E293B", lineHeight: 1.6 }}>Bildirim gönderildi!<br />Doktor bilgilendirildi.</p></div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Fga label="Hastane Seçin *">
                  <select style={s.inpa} value={talepForm.hastaneId} onChange={e => setTalepForm({ ...talepForm, hastaneId: e.target.value, uzmanlik: "", doktorId: "" })}>
                    <option value="">Hastane seçiniz...</option>
                    {MOCK_HASTANELER.map(h => <option key={h.id} value={h.id}>{h.ad}</option>)}
                  </select>
                </Fga>
                <Fga label="Branş Seçin *">
                  <select style={s.inpa} value={talepForm.uzmanlik} onChange={e => setTalepForm({ ...talepForm, uzmanlik: e.target.value, doktorId: "" })} disabled={!talepForm.hastaneId}>
                    <option value="">{talepForm.hastaneId ? "Branş seçiniz..." : "Önce hastane seçin"}</option>
                    {[...new Set(doktorlar.filter(d => d.hastaneId === talepForm.hastaneId).map(d => d.uzmanlik))].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </Fga>
                <Fga label="Doktor Seçin *">
                  <select style={s.inpa} value={talepForm.doktorId} onChange={e => setTalepForm({ ...talepForm, doktorId: e.target.value })} disabled={!talepForm.uzmanlik}>
                    <option value="">{talepForm.uzmanlik ? "Doktor seçiniz..." : "Önce branş seçin"}</option>
                    {doktorlar.filter(d => d.hastaneId === talepForm.hastaneId && d.uzmanlik === talepForm.uzmanlik).map(d => <option key={d.id} value={d.id}>{d.ad}</option>)}
                  </select>
                </Fga>
                <Fga label="Hasta (Baş Harfler + Yaş) *">
                  <input style={s.inpa} placeholder="örn. A.Y. - 45 yaş" value={talepForm.hasta} onChange={e => setTalepForm({ ...talepForm, hasta: e.target.value })} />
                </Fga>
                <Fga label="İlaç Adı ve Dozu *">
                  <input style={s.inpa} placeholder="örn. Metformin 1000mg" value={talepForm.ilac} onChange={e => setTalepForm({ ...talepForm, ilac: e.target.value })} />
                </Fga>
                <Fga label="Hata Türü">
                  <select style={s.inpa} value={talepForm.hataTuru} onChange={e => setTalepForm({ ...talepForm, hataTuru: e.target.value })}>
                    <option value="">Seçiniz...</option>
                    {HATA_TURLERI.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </Fga>
                <Fga label="Açıklama *">
                  <textarea style={{ ...s.inpa, height: 85, resize: "vertical" }} placeholder="SUT uyumsuzluğunu detaylı açıklayın..." value={talepForm.aciklama} onChange={e => setTalepForm({ ...talepForm, aciklama: e.target.value })} />
                </Fga>
                <div
                  onClick={() => setTalepForm({ ...talepForm, hastaBekliyor: !talepForm.hastaBekliyor })}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: talepForm.hastaBekliyor ? "1px solid #FDE68A" : "1px solid #E2E8F0", borderRadius: 9, cursor: "pointer", background: talepForm.hastaBekliyor ? "#FFFBEB" : "#F8FAFC" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, border: talepForm.hastaBekliyor ? "none" : "2px solid #CBD5E1", background: talepForm.hastaBekliyor ? "#F59E0B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {talepForm.hastaBekliyor && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 13, color: talepForm.hastaBekliyor ? "#92400E" : "#475569", fontWeight: talepForm.hastaBekliyor ? 600 : 400 }}>⏳ Hasta eczanede bekliyor</span>
                </div>

                {/* FOTOĞRAF ALANI */}
                <Fga label="Reçete Fotoğrafı">
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={fotografSec} style={{ display: "none" }} />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{ border: "1.5px dashed #CBD5E1", borderRadius: 10, padding: "14px", cursor: "pointer", background: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#38BDF8"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#CBD5E1"}
                  >
                    <span style={{ fontSize: 24 }}>📎</span>
                    <span style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>Fotoğraf seç veya buraya sürükle</span>
                    <span style={{ fontSize: 11, color: "#94A3B8" }}>JPG, PNG · Maks. 5MB · Çoklu seçim</span>
                  </div>
                  {talepFotograflar.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                      {talepFotograflar.map(f => (
                        <div key={f.id} style={{ position: "relative", width: 72, height: 72 }}>
                          <img src={f.src} alt={f.ad} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid #E2E8F0", cursor: "pointer" }} onClick={() => setBuyukFoto(f.src)} />
                          <button onClick={() => fotografKaldir(f.id)} style={{ position: "absolute", top: -6, right: -6, background: "#EF4444", color: "#fff", border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </Fga>

                <button style={{ ...s.gonderBtn, opacity: (!talepForm.hasta || !talepForm.ilac || !talepForm.doktorId || !talepForm.aciklama) ? 0.5 : 1 }} onClick={talepGonder} disabled={!talepForm.hasta || !talepForm.ilac || !talepForm.doktorId || !talepForm.aciklama}>
                  Talebi Gönder →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {yeniGonderiAcik && (
        <div style={s.ov} onClick={() => setYeniGonderiAcik(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: 0 }}>Yeni Forum Gönderisi</h3>
              <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#94A3B8" }} onClick={() => setYeniGonderiAcik(false)}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Fga label="Kanal">
                <select style={s.inpa} value={gonderiForm.kanal} onChange={e => setGonderiForm({ ...gonderiForm, kanal: e.target.value })}>
                  <option value="genel">📢 Genel Duyurular</option>
                  <option value="sut">📄 SUT Duyuruları</option>
                  {(rol === "eczaci" || rol === "doktor") && <option value="etken">💊 Etken Madde Danışma</option>}
                </select>
              </Fga>
              <Fga label="Başlık *">
                <input style={s.inpa} placeholder="Gönderi başlığı..." value={gonderiForm.baslik} onChange={e => setGonderiForm({ ...gonderiForm, baslik: e.target.value })} />
              </Fga>
              <Fga label="İçerik *">
                <textarea style={{ ...s.inpa, height: 120, resize: "vertical" }} placeholder="Detayları yazın..." value={gonderiForm.icerik} onChange={e => setGonderiForm({ ...gonderiForm, icerik: e.target.value })} />
              </Fga>
              <button style={{ ...s.gonderBtn, opacity: (!gonderiForm.baslik || !gonderiForm.icerik) ? 0.5 : 1 }} onClick={gonderiEkle} disabled={!gonderiForm.baslik || !gonderiForm.icerik}>Gönder →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetayPanel({ t, rol, aktif, doktor, onGuncelle, onMesaj, onFotoBuyut }) {
  const [mesajInput, setMesajInput] = useState("");
  const st = ST[t.durum];
  const handleMesaj = () => { if (!mesajInput.trim()) return; onMesaj(t.id, mesajInput); setMesajInput(""); };

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #E2E8F0", maxWidth: 640 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h2 style={{ fontSize: 21, fontWeight: 700, color: "#0F172A", margin: 0 }}>{t.ilac}</h2>
          <p style={{ color: "#64748B", fontSize: 14, marginTop: 4 }}>{t.hasta}</p>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: st.bg, color: st.color, fontSize: 12, fontWeight: 600 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot, display: "inline-block" }} />{st.label}
        </span>
      </div>
      {t.hastaBekliyor && <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}><span style={{ fontSize: 16 }}>⏳</span><span style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>Hasta eczanede bekliyor — Lütfen öncelikli işleme alın.</span></div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[["Doktor", doktor?.ad], ["Uzmanlık", doktor?.uzmanlik], ["Hastane", doktor?.hastane], ["Diploma No", doktor?.diplomaNo], ["Hata Türü", t.hataTuru || "—"], ["Tarih", t.tarih]].map(([k, v]) => (
          <div key={k} style={{ background: "#F8FAFC", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{k}</div>
            <div style={{ fontSize: 12, color: "#1E293B", fontWeight: 500 }}>{v || "—"}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Hata Açıklaması</div>
        <p style={{ fontSize: 14, color: "#1E293B", lineHeight: 1.65, margin: 0 }}>{t.aciklama}</p>
      </div>

      {/* REÇETE FOTOĞRAFLARI */}
      {t.fotograflar?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>📎 Reçete Fotoğrafları ({t.fotograflar.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {t.fotograflar.map(f => (
              <div key={f.id} style={{ position: "relative" }}>
                <img
                  src={f.src} alt={f.ad}
                  onClick={() => onFotoBuyut(f.src)}
                  style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 10, border: "1px solid #E2E8F0", cursor: "zoom-in", transition: "transform 0.15s" }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 9, padding: "3px 5px", borderRadius: "0 0 10px 10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.ad}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(rol === "doktor" || rol === "sekreter") && t.durum === "beklemede" && (
        <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Durumu Güncelle</div>
          {rol === "sekreter" && <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#92400E" }}>⚠️ Bu işlem sekreter olarak adınıza kayıt edilecektir.</div>}
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ padding: "10px 22px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, background: "#10B981", color: "#fff" }} onClick={() => onGuncelle(t.id, "düzeltildi")}>✓ Düzelttim</button>
            <button style={{ padding: "10px 22px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, background: "#F1F5F9", color: "#EF4444" }} onClick={() => onGuncelle(t.id, "reddedildi")}>✗ Reddet</button>
          </div>
        </div>
      )}
      {(rol === "doktor" || rol === "sekreter") && t.durum !== "beklemede" && (
        <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 14, marginBottom: 16, color: "#94A3B8", fontSize: 13 }}>
          Bu bildirim işleme alındı.{t.guncelleyen && <span style={{ marginLeft: 6 }}>— {t.guncelleyen} tarafından güncellendi.</span>}
        </div>
      )}

      {/* MİNİ CHAT */}
      <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
        <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>💬 Mesajlar</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12, maxHeight: 220, overflowY: "auto" }}>
          {(!t.mesajlar || t.mesajlar.length === 0) && (
            <div style={{ fontSize: 12, color: "#CBD5E1", textAlign: "center", padding: "14px 0" }}>Henüz mesaj yok. İlk mesajı siz gönderin.</div>
          )}
          {(t.mesajlar || []).map(m => {
            const benimMi = m.yazar === aktif?.ad;
            const rk = ROL_RENK[m.yazarRol] || ROL_RENK.eczaci;
            return (
              <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: benimMi ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "80%", background: benimMi ? "#0F172A" : "#F1F5F9", color: benimMi ? "#fff" : "#1E293B", borderRadius: benimMi ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "9px 13px", fontSize: 13, lineHeight: 1.5 }}>
                  {m.icerik}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                  <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 20, background: rk.bg, color: rk.color, fontWeight: 600 }}>{rk.label}</span>
                  <span style={{ fontSize: 10, color: "#CBD5E1" }}>{m.yazar} · {m.tarih}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{ flex: 1, padding: "9px 12px", borderRadius: 9, border: "1px solid #E2E8F0", fontSize: 13, outline: "none", fontFamily: "sans-serif" }}
            placeholder="Mesaj yaz... (Enter ile gönder)"
            value={mesajInput}
            onChange={e => setMesajInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleMesaj()}
          />
          <button onClick={handleMesaj} style={{ background: "#0F172A", color: "#fff", border: "none", padding: "9px 16px", borderRadius: 9, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Gönder</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrap: { minHeight: "100vh", background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F172A 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: 20 },
  card: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "42px 38px", maxWidth: 440, width: "100%", textAlign: "center", backdropFilter: "blur(20px)" },
  logoRow: { display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 },
  rx: { fontSize: 46, fontWeight: 700, color: "#38BDF8", fontFamily: "Georgia, serif", letterSpacing: -2 },
  br: { fontSize: 30, fontWeight: 300, color: "rgba(255,255,255,0.85)", letterSpacing: 2 },
  logoAlt: { color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginTop: 4 },
  ayrac: { width: 48, height: 1, background: "rgba(255,255,255,0.15)", margin: "20px auto" },
  aciklama: { color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 20 },
  rolRow: { display: "flex", gap: 12, marginBottom: 22 },
  rolBtn: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "16px 8px", borderRadius: 14, border: "1px solid", cursor: "pointer", background: "rgba(255,255,255,0.04)" },
  rolLabel: { fontSize: 14, fontWeight: 600, color: "#fff" },
  rolAlt: { fontSize: 10, color: "rgba(255,255,255,0.4)" },
  not: { fontSize: 11, color: "rgba(255,255,255,0.2)" },
  fBaslik: { color: "#fff", fontSize: 17, fontWeight: 600, marginBottom: 18, textAlign: "left" },
  inp: { padding: "10px 13px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: 14, outline: "none", fontFamily: "sans-serif", width: "100%", boxSizing: "border-box" },
  hata: { color: "#F87171", fontSize: 13, background: "rgba(239,68,68,0.1)", padding: "8px 12px", borderRadius: 8, marginBottom: 10, textAlign: "left" },
  submit: { width: "100%", background: "#38BDF8", color: "#0F172A", border: "none", padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", marginBottom: 12 },
  kayitRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 },
  kayitMetin: { color: "rgba(255,255,255,0.4)", fontSize: 13 },
  kayitLink: { background: "none", border: "none", color: "#38BDF8", fontSize: 13, cursor: "pointer", fontWeight: 600 },
  geri: { background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 13, cursor: "pointer" },
  header: { background: "#0F172A", padding: "0 24px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" },
  rx2: { fontSize: 22, fontWeight: 700, color: "#38BDF8", fontFamily: "Georgia, serif" },
  br2: { fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,0.7)", letterSpacing: 1.5 },
  cikisBtn: { background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.6)", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12 },
  sol: { width: 355, borderRight: "1px solid #E2E8F0", background: "#fff", display: "flex", flexDirection: "column" },
  solBaslik: { padding: "15px 18px", fontWeight: 700, fontSize: 14, color: "#0F172A", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F1F5F9" },
  sayac: { marginLeft: 6, background: "#F1F5F9", color: "#64748B", fontSize: 11, padding: "2px 7px", borderRadius: 12, fontWeight: 600 },
  yeniBtn: { background: "#0F172A", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 },
  bosL: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 180, gap: 10, color: "#94A3B8", fontSize: 13 },
  talepK: { padding: "13px 17px", borderBottom: "1px solid #F1F5F9", cursor: "pointer" },
  talepKS: { background: "#F0F9FF", borderLeft: "3px solid #38BDF8" },
  ov: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
  modal: { background: "#fff", borderRadius: 18, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" },
  inpa: { padding: "10px 12px", borderRadius: 9, border: "1px solid #E2E8F0", fontSize: 13, color: "#0F172A", outline: "none", fontFamily: "sans-serif", width: "100%", boxSizing: "border-box" },
  gonderBtn: { background: "#0F172A", color: "#fff", border: "none", padding: "13px", borderRadius: 11, fontWeight: 700, fontSize: 14, cursor: "pointer", width: "100%" },
};
