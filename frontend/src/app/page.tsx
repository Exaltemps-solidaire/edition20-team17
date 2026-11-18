"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { PROFILS, trouverProfil, type Profil } from "../lib/profils";
import { ecranApresQualification, type ReponseDiagnostic } from "../lib/qualification";
import { estImageValide } from "../lib/media";
import { clamperScore, scoresInitiaux, THEMES, type Scores, type Theme } from "../lib/score";

const MENTIONS_MEDECIN = [
  "Un traitement hormonal a été évoqué",
  "Une intervention chirurgicale a été mentionnée",
  "La question de la fertilité a été abordée",
  "Je ne me souviens pas bien de ce qui a été dit",
];

const RESSENTIS = [
  "😰 Inquiète",
  "😮‍💨 Soulagée",
  "😢 Triste",
  "😤 En colère",
  "😶 Perdue",
  "💪 Prête à agir",
  "🤷 Incertaine",
  "😌 Sereine",
];

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

function EcranQualification({
  onRetour,
  onRepondre,
}: {
  onRetour: () => void;
  onRepondre: (reponse: ReponseDiagnostic) => void;
}) {
  return (
    <section className={styles.screen}>
      <div className={styles.chatHeader}>
        <button type="button" className={styles.backBtn} onClick={onRetour} aria-label="Retour">
          ←
        </button>
        <div className={styles.chatHeaderName}>Assistant ENDOmind</div>
      </div>
      <div className={styles.chatMessages}>
        <div className={styles.msgBot}>
          Bonjour et bienvenue. Je suis là pour vous orienter vers les ressources d&apos;ENDOmind
          qui correspondent à votre situation.
        </div>
        <div className={styles.msgBot}>
          <strong>Avez-vous reçu un diagnostic d&apos;endométriose&nbsp;?</strong>
        </div>
      </div>
      <div className={styles.chatChoices}>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={() => onRepondre("oui")}
        >
          Oui, j&apos;ai été diagnostiquée
        </button>
        <button type="button" className={styles.btnSecondary} onClick={() => onRepondre("non")}>
          Non, pas encore
        </button>
      </div>
    </section>
  );
}

function EcranRenvoiSoignant({ onRetour }: { onRetour: () => void }) {
  return (
    <section className={styles.screen}>
      <div className={styles.chatHeader}>
        <button type="button" className={styles.backBtn} onClick={onRetour} aria-label="Retour">
          ←
        </button>
        <div className={styles.chatHeaderName}>Assistant ENDOmind</div>
      </div>
      <div className={styles.chatMessages}>
        <div className={styles.msgBot}>
          Merci pour votre réponse. Je ne suis pas en mesure de vous aider à obtenir un diagnostic
          — c&apos;est le rôle de votre médecin ou gynécologue.
        </div>
        <div className={styles.msgBot}>
          Si vous ressentez des symptômes qui vous inquiètent, voici ce que vous pouvez faire :
        </div>
      </div>
      <div className={styles.orientBox}>
        <div className={styles.orientTitle}>
          Parlez-en à un·e professionnel·le de santé formé·e
        </div>
        <p>
          Vous pouvez consulter la <strong>carte des filières de soins</strong> d&apos;ENDOmind
          pour trouver un·e spécialiste proche de chez vous.
        </p>
      </div>
    </section>
  );
}

function EcranDiagnosticRessenti({
  mentionsChoisies,
  onToggleMention,
  description,
  onChangerDescription,
  nomPhoto,
  erreurPhoto,
  onChoisirPhoto,
  ressentisChoisis,
  onToggleRessenti,
  onRetour,
  onContinuer,
}: {
  mentionsChoisies: Set<string>;
  onToggleMention: (mention: string) => void;
  description: string;
  onChangerDescription: (description: string) => void;
  nomPhoto: string | null;
  erreurPhoto: string | null;
  onChoisirPhoto: (fichier: File) => void;
  ressentisChoisis: Set<string>;
  onToggleRessenti: (ressenti: string) => void;
  onRetour: () => void;
  onContinuer: () => void;
}) {
  return (
    <section className={styles.screen}>
      <div className={styles.chatHeader}>
        <button type="button" className={styles.backBtn} onClick={onRetour} aria-label="Retour">
          ←
        </button>
        <div className={styles.chatHeaderName}>Assistant ENDOmind</div>
      </div>
      <div className={styles.chatMessages}>
        <div className={styles.msgUser}>Oui, j&apos;ai été diagnostiquée</div>
        <div className={styles.msgBot}>
          Merci. Recevoir un diagnostic, ça soulage et ça fait peur en même temps. Vous êtes au
          bon endroit.
        </div>
        <div className={styles.msgBot}>
          <strong>Qu&apos;est-ce que le médecin vous a dit&nbsp;?</strong> (cochez ce qui vous a
          été mentionné)
        </div>
      </div>
      <div className={styles.mentionsList}>
        {MENTIONS_MEDECIN.map((mention) => (
          <label key={mention} className={styles.mentionLabel}>
            <input
              type="checkbox"
              checked={mentionsChoisies.has(mention)}
              onChange={() => onToggleMention(mention)}
            />
            {mention}
          </label>
        ))}
      </div>
      <div className={styles.libreBlock}>
        <label className={styles.libreLabel} htmlFor="description-libre">
          Ou décrivez-le avec vos mots
        </label>
        <textarea
          id="description-libre"
          className={styles.libreTextarea}
          value={description}
          onChange={(e) => onChangerDescription(e.target.value)}
          placeholder="Ce que le médecin m'a dit..."
          rows={3}
        />
      </div>
      <div className={styles.photoBlock}>
        <label className={styles.libreLabel} htmlFor="photo-diagnostic">
          Ajouter une photo (ex. le compte-rendu), facultatif
        </label>
        <input
          id="photo-diagnostic"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const fichier = e.target.files?.[0];
            if (fichier) onChoisirPhoto(fichier);
          }}
        />
        {erreurPhoto && <p className={styles.photoErreur}>{erreurPhoto}</p>}
        {nomPhoto && <p className={styles.photoNom}>{nomPhoto}</p>}
      </div>
      <div className={styles.chatMessages}>
        <div className={styles.msgBot}>
          <strong>Comment vous sentez-vous face à cette nouvelle&nbsp;?</strong>
        </div>
      </div>
      <div className={styles.emotionsGrid}>
        {RESSENTIS.map((ressenti) => (
          <button
            key={ressenti}
            type="button"
            className={`${styles.emotionBtn} ${
              ressentisChoisis.has(ressenti) ? styles.emotionBtnSelected : ""
            }`}
            onClick={() => onToggleRessenti(ressenti)}
          >
            {ressenti}
          </button>
        ))}
      </div>
      <div className={styles.chatChoices}>
        <button type="button" className={styles.btnPrimary} onClick={onContinuer}>
          Continuer →
        </button>
      </div>
    </section>
  );
}

function EcranNiveauInterrogation({
  scores,
  onChangerScore,
  onRetour,
}: {
  scores: Scores;
  onChangerScore: (theme: Theme, valeur: number) => void;
  onRetour: () => void;
}) {
  return (
    <section className={styles.screen}>
      <div className={styles.chatHeader}>
        <button type="button" className={styles.backBtn} onClick={onRetour} aria-label="Retour">
          ←
        </button>
        <div className={styles.chatHeaderName}>Assistant ENDOmind</div>
      </div>
      <div className={styles.chatMessages}>
        <div className={styles.msgBot}>
          <strong>Pour chaque thème, indiquez à quel point vous vous interrogez&nbsp;:</strong>
          <br />
          <span style={{ fontSize: 13, color: "#666" }}>1 = peu d&apos;interrogation · 5 = beaucoup</span>
        </div>
      </div>
      <div className={styles.themesList}>
        {THEMES.map((theme) => (
          <div key={theme.id} className={styles.themeItem}>
            <div className={styles.themeLabel}>{theme.label}</div>
            <div className={styles.themeSteps}>
              {[1, 2, 3, 4, 5].map((valeur) => (
                <button
                  key={valeur}
                  type="button"
                  aria-label={`${theme.label} : ${valeur}`}
                  className={`${styles.themeStep} ${
                    valeur <= scores[theme.id] ? styles.themeStepActive : ""
                  }`}
                  onClick={() => onChangerScore(theme.id, valeur)}
                >
                  {valeur}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

type Vue = "accueil" | "qualification" | "renvoi-soignant" | "diagnostic" | "niveau-interrogation";

export default function Home() {
  const [profilId, setProfilId] = useState<string | null>(null);
  const [vue, setVue] = useState<Vue>("accueil");
  const [mentionsChoisies, setMentionsChoisies] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState("");
  const [nomPhoto, setNomPhoto] = useState<string | null>(null);
  const [erreurPhoto, setErreurPhoto] = useState<string | null>(null);
  const [ressentisChoisis, setRessentisChoisis] = useState<Set<string>>(new Set());
  const [scores, setScores] = useState<Scores>(scoresInitiaux());

  const profil = profilId ? trouverProfil(profilId) : undefined;

  function basculer(set: Set<string>, valeur: string) {
    const copie = new Set(set);
    if (copie.has(valeur)) {
      copie.delete(valeur);
    } else {
      copie.add(valeur);
    }
    return copie;
  }

  function choisirPhoto(fichier: File) {
    if (!estImageValide(fichier.type)) {
      setErreurPhoto("Ce fichier n'est pas une image.");
      setNomPhoto(null);
      return;
    }
    setErreurPhoto(null);
    setNomPhoto(fichier.name);
  }

  function changerScore(theme: Theme, valeur: number) {
    setScores((precedent) => ({ ...precedent, [theme]: clamperScore(valeur) }));
  }

  if (!profil) {
    return (
      <div className={styles.page}>
        <EcranChoixProfil onChoisir={(p) => setProfilId(p.id)} />
      </div>
    );
  }

  let ecran;
  switch (vue) {
    case "accueil":
      ecran = (
        <EcranAccueil
          profil={profil}
          onChangerProfil={() => setProfilId(null)}
          onDemarrerChatbot={() => setVue("qualification")}
        />
      );
      break;
    case "qualification":
      ecran = (
        <EcranQualification
          onRetour={() => setVue("accueil")}
          onRepondre={(reponse) => setVue(ecranApresQualification(reponse))}
        />
      );
      break;
    case "renvoi-soignant":
      ecran = <EcranRenvoiSoignant onRetour={() => setVue("qualification")} />;
      break;
    case "diagnostic":
      ecran = (
        <EcranDiagnosticRessenti
          mentionsChoisies={mentionsChoisies}
          onToggleMention={(mention) =>
            setMentionsChoisies((set) => basculer(set, mention))
          }
          description={description}
          onChangerDescription={setDescription}
          nomPhoto={nomPhoto}
          erreurPhoto={erreurPhoto}
          onChoisirPhoto={choisirPhoto}
          ressentisChoisis={ressentisChoisis}
          onToggleRessenti={(ressenti) =>
            setRessentisChoisis((set) => basculer(set, ressenti))
          }
          onRetour={() => setVue("qualification")}
          onContinuer={() => setVue("niveau-interrogation")}
        />
      );
      break;
    case "niveau-interrogation":
      ecran = (
        <EcranNiveauInterrogation
          scores={scores}
          onChangerScore={changerScore}
          onRetour={() => setVue("diagnostic")}
        />
      );
      break;
  }

  return <div className={styles.page}>{ecran}</div>;
}
