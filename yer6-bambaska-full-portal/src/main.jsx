
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, AlertTriangle, Ban, Bell, BookOpen, CheckCircle2, ClipboardList,
  Crown, Database, Eye, FileText, Gavel, Headphones, Home, Image as ImageIcon,
  Layers3, Lock, LogOut, MapPin, MessageSquare, Music2, Pause, Play,
  Radio, Save, Search, Settings, Shield, ShieldCheck, SkipForward, Sparkles,
  Star, Ticket, Trophy, UserCog, UserPlus, Users, XCircle, Zap
} from "lucide-react";
import "./style.css";

const scenes = [
  { title: "Yer6 Profil", img: "/images/yer6-scene-1.jpg", text: "Karakter hikayeni İstanbul sokaklarında yaz." },
  { title: "Ekip Ruhu", img: "/images/yer6-scene-2.jpg", text: "Aile, ekip ve sosyal rol akışları için özel sistem." },
  { title: "Operasyon Odası", img: "/images/yer6-scene-3.jpg", text: "Yetkili, legal, illegal ve özel ekip rolleri." },
  { title: "İstanbul Gecesi", img: "/images/yer6-scene-4.jpg", text: "Neon şehir atmosferi ve özel portal tasarımı." },
  { title: "Metro Portal", img: "/images/yer6-scene-5.jpg", text: "Anadolu tarzı değil, YER6'e özel yepyeni arayüz." },
  { title: "Founder Kontrol", img: "/images/yer6-scene-6.jpg", text: "Founder için yönetim, log, ban ve başvuru takibi." },
];

const tracks = [
  { title: "LVCB5 - Random 01", src: "/music/lvcb5-1.mp3" },
  { title: "LVCB5 - Random 02", src: "/music/lvcb5-2.mp3" },
  { title: "LVCB5 - Random 03", src: "/music/lvcb5-3.mp3" },
];

const supportTypes = ["Oyuncu Şikayet", "Ban İtiraz", "Yetkili Şikayet", "Teknik Destek", "Donate Destek", "Diğer"];

const ranks = [
  { name: "Staff I", level: 10, staff: false, app: false, punish: false, ticket: true, founder: false },
  { name: "Staff II", level: 20, staff: false, app: false, punish: true, ticket: true, founder: false },
  { name: "Head Staff", level: 60, staff: false, app: true, punish: true, ticket: true, founder: false },
  { name: "General Admin", level: 100, staff: true, app: true, punish: true, ticket: true, founder: false },
  { name: "Founder", level: 999, staff: true, app: true, punish: true, ticket: true, founder: true },
];

const starterAdmins = [
  { username: "Arda Eker", password: "Arda1234", discordId: "1144954440667910155", role: "Founder" },
  { username: "Can Polat", password: "123456", discordId: "987654321098765432", role: "Founder" },
];

const punishments = [
  ["Ailevi Değerlere Küfür (ADK)", "3 Gün WL", "Ağır"],
  ["Aktif Rolde Desteğe Çıkmak", "4x Uyarı", "Orta"],
  ["Aile Kıyafet Kurallarına Uymamak / Claimsiz Gezmek", "3x Uyarı", "Orta"],
  ["Başka Ailenin Claimini Kullanmak", "1 Gün WL", "Ağır"],
  ["Badcop (BC)", "2 Gün WL + İhraç + CK", "Ağır"],
  ["Bug Abuse", "3 Gün WL", "Ağır"],
  ["Combatlog", "2 Gün WL + Envanter Silinecek", "Ağır"],
  ["Copbait (Normal)", "3x Uyarı", "Orta"],
  ["Copbait (Rol Baltalama)", "2 Gün WL", "Ağır"],
  ["Destekte Yetkiliye Saygısızlık/Küfür", "1 Gün WL", "Ağır"],
  ["Dini Değerlere Küfür (DDK)", "PERMA", "Perma"],
  ["Dupe / Eşya-Silah Çoğaltma", "PERMA", "Perma"],
  ["Fail RP", "4x Uyarı", "Orta"],
  ["Fear RP", "4x Uyarı", "Orta"],
  ["Force RP", "4x Uyarı", "Orta"],
  ["Hile / 3. Parti Yazılım", "PERMA", "Perma"],
  ["IC/OOC Mixing", "1 Gün WL", "Ağır"],
  ["İzinsiz ERP", "1 Gün WL", "Ağır"],
  ["Kadın Oyuncuya Taciz", "PERMA", "Perma"],
  ["Low RP", "2 Gün WL", "Ağır"],
  ["Meta Gaming", "2 Gün WL", "Ağır"],
  ["Milli Değerlere Küfür (MDK)", "PERMA", "Perma"],
  ["NLR / New Life Rule", "1 Gün WL", "Ağır"],
  ["Non-RP Driving", "4x Uyarı", "Orta"],
  ["Power Gaming", "1 Gün WL", "Ağır"],
  ["RDM", "1 Gün WL", "Ağır"],
  ["Refuse RP", "1 Gün WL", "Ağır"],
  ["Revenge Kill", "1 Gün WL", "Ağır"],
  ["Rol Baltalama", "1 Gün WL", "Ağır"],
  ["Sunucuya Küfür", "PERMA", "Perma"],
  ["Tehdit / Şantaj / Data Sorgusu / Sanal Mafyacılık", "PERMA", "Perma"],
  ["Triggerlamak", "1 Gün WL", "Ağır"],
  ["VDM", "1 Gün WL", "Ağır"],
  ["Yetkiliyi Kandırmak", "2 Gün WL", "Ağır"],
  ["Yetkiliye Ağır Hakaret", "4 Gün WL", "Ağır"],
  ["WL Cezası Varken Oyuna Girmek", "1 Gün WL", "Ağır"],
].map(([name, penalty, level], index) => ({ id: index + 1, name, penalty, level }));

function getRank(role) {
  return ranks.find((rank) => rank.name === role) || ranks[0];
}

function isValidSteam(url) {
  return /^https:\/\/steamcommunity\.com\/(id|profiles)\/[A-Za-z0-9_-]+\/?$/.test(String(url || "").trim());
}

function Logo({ small = false }) {
  return (
    <div className={small ? "logo small" : "logo"}>
      <div className="logoRing" />
      <Crown className="logoCrown" />
      <span>Y6</span>
      {!small && <b>ISTANBUL</b>}
    </div>
  );
}

function Button({ children, onClick, disabled = false, variant = "primary", className = "" }) {
  return (
    <button disabled={disabled} onClick={onClick} className={`btn ${variant === "ghost" ? "ghost" : ""} ${variant === "dark" ? "dark" : ""} ${className}`}>
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function Field({ value, onChange, placeholder, type = "text", disabled = false }) {
  return <input disabled={disabled} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="field" />;
}

function TextArea({ value, onChange, placeholder, disabled = false }) {
  return <textarea disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="textarea" />;
}

function Badge({ children, tone = "default" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function SectionTitle({ kicker, title, text }) {
  return (
    <div className="sectionTitle">
      <span>{kicker}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function Stat({ icon: Icon, title, value }) {
  return (
    <Card className="stat">
      <Icon />
      <div>
        <p>{title}</p>
        <b>{value}</b>
      </div>
    </Card>
  );
}

function Row({ children }) {
  return <div className="row">{children}</div>;
}

function LogBox({ logs }) {
  return (
    <Card className="pad">
      <h2>Canlı Log Akışı</h2>
      <div className="logList">
        {logs.map((log, i) => (
          <div className="logItem" key={i}>
            <Radio size={15} />
            <span>{log}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MusicPanel() {
  const [trackIndex, setTrackIndex] = useState(() => Math.floor(Math.random() * tracks.length));
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState("Play tuşuna bas.");
  const audioRef = useRef(null);
  const track = tracks[trackIndex];

  function play() {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.35;
    audioRef.current.play().then(() => {
      setPlaying(true);
      setNotice("Çalıyor");
    }).catch(() => {
      setNotice("MP3 yok veya tarayıcı engelledi.");
      setPlaying(false);
    });
  }

  function pause() {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setPlaying(false);
    setNotice("Duraklatıldı");
  }

  function next() {
    setTrackIndex((v) => (v + 1) % tracks.length);
    setNotice("Şarkı değişti.");
  }

  useEffect(() => {
    if (playing && audioRef.current) {
      audioRef.current.play().catch(() => setNotice("MP3 bulunamadı."));
    }
  }, [trackIndex, playing]);

  return (
    <Card className="musicPanel">
      <audio ref={audioRef} src={track.src} loop />
      <div className="musicTop">
        <Headphones />
        <div>
          <small>YER6 RADYO</small>
          <b>{track.title}</b>
          <p>{notice}</p>
        </div>
      </div>
      <div className="musicButtons">
        <Button onClick={playing ? pause : play}>{playing ? <Pause size={16} /> : <Play size={16} />}</Button>
        <Button variant="ghost" onClick={next}><SkipForward size={16} /></Button>
      </div>
    </Card>
  );
}

function Landing({ openLogin, openRules, playersCount }) {
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveScene((v) => (v + 1) % scenes.length), 4700);
    return () => clearInterval(timer);
  }, []);

  const scene = scenes[activeScene];

  return (
    <div className="landing">
      <MusicPanel />

      <aside className="sideRail">
        <Logo small />
        <button className="railActive"><Home size={18} /></button>
        <button onClick={openRules}><BookOpen size={18} /></button>
        <button onClick={() => openLogin("player-register")}><UserPlus size={18} /></button>
        <button onClick={() => openLogin("admin-login")}><ShieldCheck size={18} /></button>
      </aside>

      <header className="topBar">
        <div className="brandText">
          <b>YER6</b>
          <span>İstanbul Roleplay Portal</span>
        </div>
        <nav>
          <button>Ana Ekran</button>
          <button onClick={openRules}>Kurallar</button>
          <button onClick={() => openLogin("player-register")}>Kayıt</button>
          <button>Discord</button>
        </nav>
        <Button onClick={() => openLogin("admin-login")}><Lock size={16} /> Founder Panel</Button>
      </header>

      <section className="heroPortal">
        <div className="heroBg">
          {scenes.map((s, i) => (
            <img key={s.title} src={s.img} className={i === activeScene ? "show" : ""} alt={s.title} />
          ))}
          <div className="heroOverlay" />
          <div className="gridOverlay" />
        </div>

        <div className="heroMain">
          <div className="heroCopy">
            <span className="pill"><MapPin size={15} /> İSTANBUL / YER6 PORTAL V2</span>
            <h1>YER6 <br /><em>Metro Portal</em></h1>
            <p>Anadolu kopyası değil; YER6 için sıfırdan tasarlanmış, farklı konseptli, dolu dolu roleplay portalı.</p>
            <div className="heroActions">
              <Button onClick={() => openLogin("player-register")}><UserPlus size={18} /> Direkt Kayıt Ol</Button>
              <Button variant="ghost" onClick={() => openLogin("admin-login")}><Crown size={18} /> Founder Giriş</Button>
            </div>
          </div>

          <Card className="liveCard">
            <div className="liveHead">
              <span className="onlineDot" />
              <div>
                <h3>YER6 LIVE</h3>
                <p>Aktif Portal</p>
              </div>
            </div>
            <div className="scenePreview">
              <img src={scene.img} alt={scene.title} />
              <div>
                <b>{scene.title}</b>
                <small>{scene.text}</small>
              </div>
            </div>
            <div className="serverLines">
              <div><span>Oyuncu</span><b>{playersCount}</b></div>
              <div><span>Harita</span><b>İstanbul</b></div>
              <div><span>Kayıt</span><b>Direkt Aktif</b></div>
              <div><span>Panel</span><b>Founder</b></div>
            </div>
          </Card>
        </div>
      </section>

      <section className="quickStats">
        <Stat icon={Users} title="Direkt Kayıt" value="Aktif" />
        <Stat icon={Shield} title="Founder Panel" value="Full" />
        <Stat icon={Ticket} title="Destek" value="Canlı" />
        <Stat icon={Database} title="Log" value="Açık" />
      </section>

      <section className="ecosystem">
        <SectionTitle kicker="SİSTEMLER" title="YER6 Ekosistemi" text="Site sadece giriş ekranı değil; oyuncu, yetkili ve founder tarafını ayıran tam portal." />
        <div className="systemGrid">
          {[
            [UserPlus, "Direkt Oyuncu Kayıt", "Onay beklemeden kayıt, Steam kontrolü ve oyuncu paneline geçiş."],
            [MessageSquare, "Destek Merkezi", "Şikayet, teknik destek, ban itirazı ve yetkili şikayeti."],
            [FileText, "Yetkili Başvurusu", "Oyuncular tek seferlik başvuru gönderir, founder inceler."],
            [Ban, "AntiCheat / Ban", "Discord ID ve Steam bilgisiyle ban kayıt sistemi."],
            [Gavel, "Ceza Kütüphanesi", "Arama destekli detaylı ceza listesi ve ceza loglama."],
            [UserCog, "Yetkili Yönetimi", "Founder yeni yetkili ekler, rütbe verir ve yönetir."],
          ].map(([Icon, title, text]) => (
            <Card className="systemCard" key={title}>
              <Icon />
              <h3>{title}</h3>
              <p>{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="showcase">
        <SectionTitle kicker="YER6 GÖRSELLERİ" title="Oyundan Kareler" text="Attığın görseller site içinde özel galeri ve arka plan olarak kullanıldı." />
        <div className="showcaseGrid">
          {scenes.slice(0, 3).map((s, i) => (
            <Card className="shotCard" key={s.title}>
              <img src={s.img} alt={s.title} />
              <div>
                <span>0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="timeline">
        <SectionTitle kicker="AKIŞ" title="Oyuncu Yolculuğu" />
        <div className="timelineGrid">
          {[
            ["01", "Kayıt Ol", "Discord ID, şifre ve Steam linki ile direkt kayıt."],
            ["02", "Oyuncu Paneli", "Destek aç, başvuru gönder, durumunu takip et."],
            ["03", "Rol Başlasın", "İstanbul temalı YER6 dünyasında rolüne başla."],
            ["04", "Founder Takibi", "Yönetim paneli üzerinden tüm işlemler loglanır."],
          ].map(([no, title, text]) => (
            <Card className="timeCard" key={no}>
              <b>{no}</b>
              <h3>{title}</h3>
              <p>{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="footer">
        <Logo small />
        <div>
          <b>YER6 ROLEPLAY</b>
          <span>İstanbul Metro Portal • Sıfırdan Özgün Tasarım</span>
        </div>
        <p>© 2026 YER6 DEV TEAM</p>
      </footer>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [admins, setAdmins] = useState(starterAdmins);
  const [players, setPlayers] = useState([
    { username: "Demo Oyuncu", password: "123456", discordId: "123456789012345678", steamUrl: "https://steamcommunity.com/profiles/76561198000000001", status: "Aktif", createdAt: "Sistem" },
  ]);
  const [tickets, setTickets] = useState([{ id: "#1021", type: "Oyuncu Şikayet", title: "RDM Şikayeti", discordId: "123456789012345678", description: "RDM şikayeti", proof: "", assigned: "Boşta", state: "Açık" }]);
  const [applications, setApplications] = useState([]);
  const [bans, setBans] = useState([]);
  const [logs, setLogs] = useState(["[Sistem] YER6 Metro Portal açıldı."]);
  const [authMode, setAuthMode] = useState("admin-login");
  const [auth, setAuth] = useState({ username: "", password: "", discordId: "", steamUrl: "" });
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [active, setActive] = useState("Dashboard");
  const [ruleSearch, setRuleSearch] = useState("");
  const [playerSearch, setPlayerSearch] = useState("");
  const [selectedPunishment, setSelectedPunishment] = useState(null);
  const [punishmentForm, setPunishmentForm] = useState({ punishedDiscordId: "", staffDiscordId: "", note: "" });
  const [supportForm, setSupportForm] = useState({ type: "Oyuncu Şikayet", title: "", description: "", proof: "" });
  const [staffAppForm, setStaffAppForm] = useState({ name: "", age: "", experience: "", reason: "" });
  const [newStaff, setNewStaff] = useState({ username: "", password: "", discordId: "", role: "Staff I" });
  const [banForm, setBanForm] = useState({ discordId: "", steamUrl: "", reason: "AntiCheat Tespiti", duration: "PERMA", proof: "" });

  const rank = currentAdmin ? getRank(currentAdmin.role) : null;
  const canFounder = Boolean(rank?.founder);
  const canStaff = Boolean(rank?.staff);
  const canApp = Boolean(rank?.app);
  const canPunish = Boolean(rank?.punish);
  const canTicket = Boolean(rank?.ticket);
  const canBan = Boolean(rank && rank.level >= 60);

  const filteredPunishments = useMemo(() => punishments.filter((p) => `${p.name} ${p.penalty}`.toLowerCase().includes(ruleSearch.toLowerCase())), [ruleSearch]);
  const filteredPlayers = useMemo(() => players.filter((p) => `${p.username} ${p.discordId} ${p.steamUrl}`.toLowerCase().includes(playerSearch.toLowerCase())), [players, playerSearch]);

  function addLog(text) {
    setLogs((prev) => [`[${new Date().toLocaleString("tr-TR")}] ${text}`, ...prev]);
  }

  function resetAuth() {
    setAuth({ username: "", password: "", discordId: "", steamUrl: "" });
  }

  function openLogin(mode) {
    setAuthMode(mode);
    setPage("login");
  }

  function loginAdmin() {
    const admin = admins.find((a) => a.discordId === auth.discordId.trim() && a.password === auth.password.trim());
    if (!admin) return addLog("Admin giriş başarısız.");
    setCurrentAdmin(admin);
    setPunishmentForm((p) => ({ ...p, staffDiscordId: admin.discordId }));
    resetAuth();
    setPage("admin");
    addLog(`${admin.username} admin girişi yaptı.`);
  }

  function registerPlayer() {
    const username = auth.username.trim();
    const password = auth.password.trim();
    const discordId = auth.discordId.trim();
    const steamUrl = auth.steamUrl.trim();
    if (!username || !password || !discordId || !steamUrl) return addLog("Oyuncu kayıt başarısız: tüm alanlar zorunlu.");
    if (!isValidSteam(steamUrl)) return addLog("Steam profil linki geçersiz.");
    if (bans.some((b) => b.discordId === discordId && b.status === "Aktif")) return addLog("Banlı kullanıcı kayıt olamaz.");
    if (players.some((p) => p.discordId === discordId || p.steamUrl === steamUrl)) return addLog("Bu Discord ID veya Steam zaten kayıtlı.");
    const newPlayer = { username, password, discordId, steamUrl, status: "Aktif", createdAt: new Date().toLocaleString("tr-TR") };
    setPlayers((prev) => [newPlayer, ...prev]);
    setCurrentPlayer(newPlayer);
    resetAuth();
    setPage("player");
    addLog(`Oyuncu direkt kayıt oldu ve giriş yaptı: ${username}`);
  }

  function loginPlayer() {
    const id = auth.discordId.trim();
    if (bans.some((b) => b.discordId === id && b.status === "Aktif")) return addLog("Banlı oyuncu siteye giriş yapamaz.");
    const p = players.find((x) => x.discordId === id && x.password === auth.password.trim());
    if (!p) return addLog("Oyuncu giriş başarısız.");
    setCurrentPlayer(p);
    resetAuth();
    setPage("player");
    addLog(`${p.username} oyuncu girişi yaptı.`);
  }

  function createTicket() {
    if (!currentPlayer?.discordId || !supportForm.title || !supportForm.description) return addLog("Destek açılamadı.");
    const t = { id: `#${1024 + tickets.length}`, type: supportForm.type, title: `${supportForm.type} - ${supportForm.title}`, discordId: currentPlayer.discordId, description: supportForm.description, proof: supportForm.proof, assigned: "Boşta", state: "Açık" };
    setTickets((prev) => [t, ...prev]);
    setSupportForm({ type: "Oyuncu Şikayet", title: "", description: "", proof: "" });
    addLog(`Destek açıldı: ${t.id}`);
  }

  function updateTicket(id, action) {
    if (!canTicket) return addLog("Bu rütbe destek işlemi yapamaz.");
    setTickets((prev) => prev.map((t) => t.id !== id ? t : action === "assign" ? { ...t, assigned: currentAdmin.username } : action === "review" ? { ...t, state: "İncelemede" } : action === "close" ? { ...t, state: "Kapalı" } : t));
    addLog(`Destek işlemi: ${id} - ${action}`);
  }

  function submitStaffApplication() {
    if (!staffAppForm.name || !staffAppForm.reason) return addLog("Yetkili başvurusu için isim ve açıklama zorunlu.");
    if (applications.some((a) => a.discordId === currentPlayer.discordId)) return addLog("Bu oyuncu zaten başvuru göndermiş.");
    setApplications((prev) => [{ ...staffAppForm, discordId: currentPlayer.discordId, steamUrl: currentPlayer.steamUrl, status: "Bekliyor", locked: false }, ...prev]);
    setStaffAppForm({ name: "", age: "", experience: "", reason: "" });
    addLog("Yetkili başvurusu gönderildi.");
  }

  function updateApplication(index, status) {
    if (!canApp) return addLog("Bu rütbe başvuru yönetemez.");
    const app = applications[index];
    if (!app || app.locked) return addLog("Bu başvuru sonuçlandırılmış.");
    setApplications((prev) => prev.map((a, i) => i === index ? { ...a, status, locked: true } : a));
    addLog(`Başvuru ${status}: ${app.name}`);
  }

  function submitPunishment() {
    if (!canPunish) return addLog("Bu rütbe ceza veremez.");
    if (!selectedPunishment || !punishmentForm.punishedDiscordId || !punishmentForm.staffDiscordId) return addLog("Ceza için Discord ID zorunlu.");
    addLog(`CEZA LOG | ${selectedPunishment.name} | ${selectedPunishment.penalty} | Ceza yiyen: ${punishmentForm.punishedDiscordId} | Yetkili: ${punishmentForm.staffDiscordId}`);
    setSelectedPunishment(null);
    setPunishmentForm({ punishedDiscordId: "", staffDiscordId: currentAdmin?.discordId || "", note: "" });
  }

  function addStaff() {
    if (!canStaff) return addLog("Bu rütbe yetkili ekleyemez.");
    if (!newStaff.username || !newStaff.password || !newStaff.discordId) return addLog("Yetkili için tüm alanlar zorunlu.");
    if (admins.some((a) => a.discordId === newStaff.discordId)) return addLog("Bu Discord ID zaten yetkili.");
    setAdmins((prev) => [{ ...newStaff }, ...prev]);
    setNewStaff({ username: "", password: "", discordId: "", role: "Staff I" });
    addLog("Yetkili eklendi.");
  }

  function removeStaff(id) {
    if (!canFounder) return addLog("Sadece Founder yetkili silebilir.");
    if (id === currentAdmin.discordId) return addLog("Kendi hesabını silemezsin.");
    setAdmins((prev) => prev.filter((a) => a.discordId !== id));
    addLog(`Yetkili silindi: ${id}`);
  }

  function submitBan() {
    if (!canBan) return addLog("Bu rütbe ban atamaz.");
    if (!banForm.discordId || !banForm.reason) return addLog("Ban için Discord ID ve sebep zorunlu.");
    if (bans.some((b) => b.discordId === banForm.discordId && b.status === "Aktif")) return addLog("Bu oyuncu zaten banlı.");
    const b = { ...banForm, id: `BAN-${1000 + bans.length}`, status: "Aktif", bannedBy: currentAdmin.username, createdAt: new Date().toLocaleString("tr-TR") };
    setBans((prev) => [b, ...prev]);
    addLog(`BAN LOG | ${b.discordId} | ${b.reason} | ${b.duration}`);
  }

  if (page === "landing") {
    return <Landing openLogin={openLogin} openRules={() => setPage("rules")} playersCount={players.length} />;
  }

  if (page === "rules") {
    return (
      <div className="portalPage">
        <header className="pageHeader">
          <div>
            <h1>YER6 Kurallar</h1>
            <p>Arama destekli ceza listesi.</p>
          </div>
          <Button variant="ghost" onClick={() => setPage("landing")}><Home size={16} /> Ana Sayfa</Button>
        </header>
        <div className="searchBox"><Search size={18} /><input value={ruleSearch} onChange={(e) => setRuleSearch(e.target.value)} placeholder="Ceza ara..." /></div>
        <Card>
          {filteredPunishments.map((p) => (
            <div className="punishmentLine" key={p.id}>
              <span>{p.id}</span>
              <b>{p.name}</b>
              <Badge tone={p.level === "Perma" || p.level === "Ağır" ? "bad" : "warn"}>{p.penalty}</Badge>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  if (page === "login") {
    const isAdmin = authMode === "admin-login";
    const isRegister = authMode === "player-register";
    return (
      <div className="loginPage">
        <Button variant="ghost" className="backBtn" onClick={() => setPage("landing")}><Home size={16} /> Ana Sayfa</Button>
        <div className="loginBg"><img src="/images/yer6-bg-1.jpg" /></div>
        <div className="loginGrid">
          <Card className="loginInfo">
            <Logo />
            <h1>YER6 PORTAL</h1>
            <p>Oyuncular onaysız direkt kayıt olur. Founder panel tüm kayıtları, banları, başvuruları ve destekleri takip eder.</p>
            <div className="founderBox">
              <div><small>FOUNDER</small><b>Can Polat</b></div>
              <div><small>FOUNDER</small><b>Arda Eker</b></div>
            </div>
          </Card>

          <Card className="loginForm">
            <h2>Giriş Merkezi</h2>
            <p>Oyuncu kayıtları direkt aktif edilir.</p>
            <div className="tabs">
              <Button onClick={() => setAuthMode("admin-login")} variant={authMode === "admin-login" ? "primary" : "ghost"}>Founder</Button>
              <Button onClick={() => setAuthMode("player-login")} variant={authMode === "player-login" ? "primary" : "ghost"}>Oyuncu</Button>
              <Button className="wide" onClick={() => setAuthMode("player-register")} variant={authMode === "player-register" ? "primary" : "ghost"}>Direkt Kayıt</Button>
            </div>
            <div className="formStack">
              {isRegister && <Field placeholder="Kullanıcı adı" value={auth.username} onChange={(v) => setAuth({ ...auth, username: v })} />}
              <Field placeholder="Discord ID" value={auth.discordId} onChange={(v) => setAuth({ ...auth, discordId: v })} />
              <Field placeholder="Şifre" type="password" value={auth.password} onChange={(v) => setAuth({ ...auth, password: v })} />
              {isRegister && <Field placeholder="Steam profil linki: https://steamcommunity.com/id/..." value={auth.steamUrl} onChange={(v) => setAuth({ ...auth, steamUrl: v })} />}
              <Button className="full" onClick={isAdmin ? loginAdmin : isRegister ? registerPlayer : loginPlayer}>
                {isAdmin ? "Founder Girişi Yap" : isRegister ? "Kayıt Ol ve Panele Gir" : "Oyuncu Girişi Yap"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (page === "player" && currentPlayer) {
    const hasApplied = applications.some((a) => a.discordId === currentPlayer.discordId);
    return (
      <div className="portalPage">
        <header className="pageHeader">
          <div>
            <h1>Oyuncu Paneli</h1>
            <p>{currentPlayer.username} • {currentPlayer.discordId}</p>
          </div>
          <Button variant="ghost" onClick={() => { setCurrentPlayer(null); setPage("landing"); }}><LogOut size={16} /> Çıkış</Button>
        </header>
        <div className="statsGrid three">
          <Stat icon={Ticket} title="Desteklerim" value={tickets.filter((t) => t.discordId === currentPlayer.discordId).length} />
          <Stat icon={FileText} title="Başvuru" value={hasApplied ? "Var" : "Yok"} />
          <Stat icon={Shield} title="Durum" value={currentPlayer.status} />
        </div>

        <div className="panelGrid">
          <Card className="pad">
            <h2>Destek Aç</h2>
            <div className="formGrid">
              <select className="field" value={supportForm.type} onChange={(e) => setSupportForm({ ...supportForm, type: e.target.value })}>
                {supportTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
              <Field placeholder="Başlık" value={supportForm.title} onChange={(v) => setSupportForm({ ...supportForm, title: v })} />
            </div>
            <TextArea placeholder="Açıklama" value={supportForm.description} onChange={(v) => setSupportForm({ ...supportForm, description: v })} />
            <Field placeholder="Kanıt linki" value={supportForm.proof} onChange={(v) => setSupportForm({ ...supportForm, proof: v })} />
            <Button onClick={createTicket}><Ticket size={16} /> Destek Gönder</Button>
          </Card>

          <Card className="pad">
            <h2>Yetkili Başvurusu</h2>
            {hasApplied && <div className="warning">Bu hesap daha önce başvuru göndermiştir.</div>}
            <div className="formGrid">
              <Field placeholder="Ad Soyad" value={staffAppForm.name} onChange={(v) => setStaffAppForm({ ...staffAppForm, name: v })} />
              <Field placeholder="Yaş" value={staffAppForm.age} onChange={(v) => setStaffAppForm({ ...staffAppForm, age: v })} />
            </div>
            <TextArea placeholder="Deneyim" value={staffAppForm.experience} onChange={(v) => setStaffAppForm({ ...staffAppForm, experience: v })} />
            <TextArea placeholder="Neden yetkili olmak istiyorsun?" value={staffAppForm.reason} onChange={(v) => setStaffAppForm({ ...staffAppForm, reason: v })} />
            <Button disabled={hasApplied} onClick={submitStaffApplication}><FileText size={16} /> Başvuru Gönder</Button>
          </Card>
        </div>
      </div>
    );
  }

  const menu = [
    { name: "Dashboard", icon: ClipboardList },
    { name: "Oyuncular", icon: Users },
    { name: "Cezalar", icon: Gavel },
    { name: "AntiCheat / Ban", icon: Ban },
    { name: "Başvurular", icon: FileText },
    { name: "Destekler", icon: Ticket },
    { name: "Yetkililer", icon: UserCog },
    { name: "Founder Ayarları", icon: Settings },
    { name: "Loglar", icon: Database },
  ];

  return (
    <div className="adminLayout">
      <aside>
        <div className="adminBrand">
          <Logo small />
          <div>
            <h2>YER6 Founder</h2>
            <p>{currentAdmin.username} • {currentAdmin.role}</p>
          </div>
        </div>
        <nav>
          {menu.map((item) => {
            const Icon = item.icon;
            return <button key={item.name} className={active === item.name ? "active" : ""} onClick={() => setActive(item.name)}><Icon size={18} />{item.name}</button>;
          })}
        </nav>
        <Button variant="ghost" onClick={() => { setCurrentAdmin(null); setPage("landing"); }}><LogOut size={16} /> Çıkış</Button>
      </aside>

      <main>
        <header className="adminTop">
          <div>
            <h1>{active}</h1>
            <p>DC: {currentAdmin.discordId} • {currentAdmin.role}</p>
          </div>
          <Button onClick={() => addLog("Bildirimler kontrol edildi.")}><Bell size={16} /> Bildirim</Button>
        </header>

        {active === "Dashboard" && (
          <>
            <div className="statsGrid">
              <Stat icon={Users} title="Oyuncu" value={players.length} />
              <Stat icon={Ticket} title="Açık Destek" value={tickets.filter((t) => t.state !== "Kapalı").length} />
              <Stat icon={Ban} title="Aktif Ban" value={bans.filter((b) => b.status === "Aktif").length} />
              <Stat icon={Crown} title="Yetki" value={currentAdmin.role} />
            </div>
            <div className="panelGrid">
              <LogBox logs={logs.slice(0, 7)} />
              <Card className="pad">
                <h2>Founder Notu</h2>
                <p className="muted">Bu tasarım Anadolu tarzı değil; YER6 için sıfırdan yapılmış metro/neon portal konseptidir. Oyuncu onayı kapalı, kayıt direkt aktiftir.</p>
              </Card>
            </div>
          </>
        )}

        {active === "Oyuncular" && (
          <>
            <div className="searchBox"><Search size={18} /><input value={playerSearch} onChange={(e) => setPlayerSearch(e.target.value)} placeholder="Oyuncu ara..." /></div>
            <Card>{filteredPlayers.map((p) => <Row key={p.discordId}><div><b>{p.username}</b><p>{p.discordId}</p><small>{p.steamUrl}</small></div><Badge tone="good">{p.status}</Badge></Row>)}</Card>
          </>
        )}

        {active === "Cezalar" && (
          <>
            <div className="searchBox"><Search size={18} /><input value={ruleSearch} onChange={(e) => setRuleSearch(e.target.value)} placeholder="Ceza ara..." /></div>
            <Card>{filteredPunishments.map((p) => <div className="punishmentLine adminPunish" key={p.id}><span>{p.id}</span><button onClick={() => setSelectedPunishment(p)}>{p.name}</button><Badge tone={p.level === "Perma" || p.level === "Ağır" ? "bad" : "warn"}>{p.penalty}</Badge><Button onClick={() => setSelectedPunishment(p)}><Save size={16} /></Button></div>)}</Card>
          </>
        )}

        {active === "AntiCheat / Ban" && (
          <>
            <Card className="pad">
              <h2>AntiCheat / Ban Paneli</h2>
              <div className="formGrid">
                <Field disabled={!canBan} placeholder="Discord ID" value={banForm.discordId} onChange={(v) => setBanForm({ ...banForm, discordId: v })} />
                <Field disabled={!canBan} placeholder="Steam linki" value={banForm.steamUrl} onChange={(v) => setBanForm({ ...banForm, steamUrl: v })} />
                <Field disabled={!canBan} placeholder="Sebep" value={banForm.reason} onChange={(v) => setBanForm({ ...banForm, reason: v })} />
                <select disabled={!canBan} className="field" value={banForm.duration} onChange={(e) => setBanForm({ ...banForm, duration: e.target.value })}>
                  <option>PERMA</option><option>1 Gün</option><option>7 Gün</option><option>30 Gün</option>
                </select>
              </div>
              <Button disabled={!canBan} onClick={submitBan}><Ban size={16} /> Ban At</Button>
            </Card>
            <Card>{bans.length === 0 && <p className="muted pad">Aktif ban yok.</p>}{bans.map((b) => <Row key={b.id}><div><b>{b.id}</b><p>{b.discordId} • {b.reason} • {b.duration}</p></div><Badge tone="bad">{b.status}</Badge></Row>)}</Card>
          </>
        )}

        {active === "Başvurular" && (
          <>
            {applications.length === 0 && <Card className="pad"><h2>Başvuru yok</h2><p className="muted">Oyuncuların yetkili başvuruları burada görünür.</p></Card>}
            {applications.map((a, i) => <Row key={`${a.discordId}-${i}`}><div><b>{a.name}</b><p>{a.discordId} • {a.status}</p><small>{a.reason}</small>{a.locked && <div className="warning">Bu başvuru sonuçlandırıldı.</div>}</div><div className="actions"><Button disabled={!canApp || a.locked} onClick={() => updateApplication(i, "Kabul Edildi")}>Kabul</Button><Button disabled={!canApp || a.locked} variant="ghost" onClick={() => updateApplication(i, "Reddedildi")}>Red</Button></div></Row>)}
          </>
        )}

        {active === "Destekler" && (
          <>
            {tickets.map((t) => <Row key={t.id}><div><b>{t.id} - {t.title}</b><p>{t.discordId} • {t.state} • {t.assigned}</p><small>{t.description}</small></div><div className="actions"><Button onClick={() => updateTicket(t.id, "assign")}>Üstlen</Button><Button variant="ghost" onClick={() => updateTicket(t.id, "review")}>İncele</Button><Button variant="ghost" onClick={() => updateTicket(t.id, "close")}>Kapat</Button><Button onClick={() => { setSelectedPunishment(punishments.find((x) => x.name === "RDM") || punishments[0]); setPunishmentForm({ punishedDiscordId: t.discordId, staffDiscordId: currentAdmin.discordId, note: `${t.id} destek üzerinden işlem` }); setActive("Cezalar"); }}>Ceza Ver</Button></div></Row>)}
          </>
        )}

        {active === "Yetkililer" && (
          <>
            <Card className="pad">
              <h2>Yetkili Ekle</h2>
              <div className="formGrid four">
                <Field disabled={!canStaff} placeholder="Ad" value={newStaff.username} onChange={(v) => setNewStaff({ ...newStaff, username: v })} />
                <Field disabled={!canStaff} placeholder="Şifre" value={newStaff.password} onChange={(v) => setNewStaff({ ...newStaff, password: v })} />
                <Field disabled={!canStaff} placeholder="Discord ID" value={newStaff.discordId} onChange={(v) => setNewStaff({ ...newStaff, discordId: v })} />
                <select disabled={!canStaff} className="field" value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}>{ranks.map((r) => <option key={r.name}>{r.name}</option>)}</select>
              </div>
              <Button disabled={!canStaff} onClick={addStaff}><UserPlus size={16} /> Yetkili Ekle</Button>
            </Card>
            <Card>{admins.map((a) => <Row key={a.discordId}><div><b>{a.username}</b><p>{a.discordId} • {a.role}</p></div><Button disabled={!canFounder} variant="ghost" onClick={() => removeStaff(a.discordId)}>Sil</Button></Row>)}</Card>
          </>
        )}

        {active === "Founder Ayarları" && (
          <>
            <div className="statsGrid three">
              <Stat icon={Activity} title="Sistem" value="Aktif" />
              <Stat icon={Eye} title="Kayıt" value="Direkt" />
              <Stat icon={Star} title="Tasarım" value="Özgün" />
            </div>
            <Card className="pad">
              <h2>Founder Ayarları</h2>
              <p className="muted">Oyuncu onayı kapalıdır. Yeni oyuncular kayıt olunca otomatik Oyuncular sekmesine düşer. Başvuru sonuçları tek sefer değişir.</p>
            </Card>
          </>
        )}

        {active === "Loglar" && <LogBox logs={logs} />}

        {selectedPunishment && (
          <div className="modal">
            <Card className="modalCard">
              <div className="modalHead">
                <div>
                  <h2>Ceza Ver</h2>
                  <p>{selectedPunishment.name}</p>
                  <Badge tone="bad">{selectedPunishment.penalty}</Badge>
                </div>
                <Button variant="ghost" onClick={() => setSelectedPunishment(null)}>Kapat</Button>
              </div>
              <div className="formGrid">
                <Field placeholder="Ceza yiyen Discord ID" value={punishmentForm.punishedDiscordId} onChange={(v) => setPunishmentForm({ ...punishmentForm, punishedDiscordId: v })} />
                <Field placeholder="Yetkili Discord ID" value={punishmentForm.staffDiscordId} onChange={(v) => setPunishmentForm({ ...punishmentForm, staffDiscordId: v })} />
              </div>
              <TextArea placeholder="Not" value={punishmentForm.note} onChange={(v) => setPunishmentForm({ ...punishmentForm, note: v })} />
              <Button onClick={submitPunishment}><Save size={16} /> Kaydet</Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
