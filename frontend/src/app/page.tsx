"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { PROFILS, trouverProfil, type Profil } from "../lib/profils";

function EcranChoixProfil({ onChoisir }: { onChoisir: (profil: Profil) => void }) {
  return (
    <section className={`${styles.screen} ${styles.picker}`}>
      <div className={styles.pickerTitle}>Qui êtes-vous ?</div>
      <p className={styles.pickerSub}>
        Choisissez un profil pour essayer Endo&apos;chat. Vous pourrez en changer à tout moment.
      </p>
      {PROFILS.map((profil) => (
        <button
          key={profil.id}
          type="button"
          className={styles.profilCard}
          onClick={() => onChoisir(profil)}
        >
          <div className={styles.profilNom}>{profil.nom}</div>
          <div className={styles.profilRole}>{profil.role}</div>
        </button>
      ))}
    </section>
  );
}

function EcranAccueil({
  profil,
  onChangerProfil,
  onDemarrerChatbot,
}: {
  profil: Profil;
  onChangerProfil: () => void;
  onDemarrerChatbot: () => void;
}) {
  return (
    <section className={styles.screen}>
      <div className={styles.siteHeader}>
        <span className={styles.logoText}>ENDOmind</span>
        <button type="button" className={styles.changerProfil} onClick={onChangerProfil}>
          {profil.nom} · changer
        </button>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroTitle}>Le diagnostic, et maintenant ?</div>
        <p className={styles.heroSub}>
          Comprendre sa maladie pour agir. ENDOmind vous aide à trouver la ressource qui vous
          correspond.
        </p>
      </div>

      <div className={styles.chatbotCard}>
        <div className={styles.chatbotCardTitle}>
          Trouvez la ressource qui vous correspond en quelques questions
        </div>
        <p className={styles.chatbotCardBody}>
          Notre assistant vous oriente vers le guide, les fiches et les groupes de parole
          d&apos;ENDOmind, selon votre situation. Il ne pose pas de diagnostic et ne remplace pas
          votre soignant·e.
        </p>
        <button type="button" className={styles.btnPrimary} onClick={onDemarrerChatbot}>
          Démarrer le questionnaire →
        </button>
      </div>
    </section>
  );
}

function EcranChatbotAVenir({ onRetour }: { onRetour: () => void }) {
  return (
    <section className={styles.screen}>
      <div className={styles.siteHeader}>
        <span className={styles.logoText}>ENDOmind</span>
      </div>
      <div className={styles.chatbotStub}>
        <p>Le questionnaire Endo&apos;chat arrive dans une prochaine itération.</p>
        <button type="button" className={styles.btnPrimary} onClick={onRetour}>
          ← Retour à l&apos;accueil
        </button>
      </div>
    </section>
  );
}

export default function Home() {
  const [profilId, setProfilId] = useState<string | null>(null);
  const [vue, setVue] = useState<"accueil" | "chatbot">("accueil");

  const profil = profilId ? trouverProfil(profilId) : undefined;

  if (!profil) {
    return (
      <div className={styles.page}>
        <EcranChoixProfil onChoisir={(p) => setProfilId(p.id)} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {vue === "accueil" ? (
        <EcranAccueil
          profil={profil}
          onChangerProfil={() => setProfilId(null)}
          onDemarrerChatbot={() => setVue("chatbot")}
        />
      ) : (
        <EcranChatbotAVenir onRetour={() => setVue("accueil")} />
      )}
    </div>
  );
}
