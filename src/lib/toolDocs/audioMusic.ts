import type { ToolMeta } from "./types";

export const toolDocs: Record<string, string> = {
  Suno: `SUNO — Full AI song generation with vocals and production

PROMPT FORMAT: Suno has TWO input fields:
1. Style Prompt (describes the SOUND): genre, tempo, instruments, vocal style, production
2. Lyrics field (with META TAGS for structure)

META TAGS (official, used in lyrics field):
[Intro], [Verse], [Verse 2], [Pre-Chorus], [Chorus], [Post-Chorus], [Bridge], [Outro]
[Instrumental], [Interlude], [Break], [Drop], [Hook], [Refrain]
[Fade In], [Fade Out], [End]

STYLE PROMPT RULES:
- Specify genre AND sub-genre: "melodic techno", "bedroom pop", "delta blues", "cinematic orchestral"
- Tempo: include BPM or feel: "120 BPM", "slow ballad", "uptempo dance"
- Instruments: "mellow piano, vinyl crackle, soft drum machine, ambient synth pads"
- Vocal style: "female vocal, ethereal and breathy", "male baritone, warm and resonant", "rap, aggressive flow"
- Production: "lo-fi bedroom production", "polished studio mix", "live concert feel", "minimalist acoustic"
- 1 mood, 1 energy direction, 2 anchor instruments, clear sections, short lines

LYRICS FIELD EXAMPLE:
[Intro]
(soft piano, building atmosphere)

[Verse 1]
Walking through the city lights alone
Every shadow tells a story of its own
The neon hums a melody I know
A lullaby for those who can't let go

[Chorus]
We're chasing echoes in the dark
Finding fire from a single spark
Hold on, hold on, don't fall apart
We're chasing echoes in the dark

[Bridge]
(stripped back, just vocals and piano)
Sometimes the silence says it all

[Outro]
(fade out with ambient reverb)

STYLE PROMPT FOR ABOVE:
"indie pop, dreamy synths, 100 BPM, female vocal soft and intimate, reverb-heavy production, nostalgic atmosphere, Phoebe Bridgers meets Lorde"`,

  Udio: `UDIO — Music with custom lyrics, genre flexibility, remix

PROMPT RULES:
- Similar structure to Suno but Udio handles genre-mixing better
- Can edit individual SECTIONS of a song — refine verse without changing chorus
- Include exact lyrics in quotes
- Mention reference artists/songs for style direction (not to copy, for direction)
- Remix functionality: generate variations that closely mimic reference audio
- Supports all languages

EXAMPLE STYLE: "chill lofi hip hop, 85 bpm, dusty vinyl samples, mellow Rhodes piano, boom bap drums with swing, no vocals, study music atmosphere, late night vibes"`,

  ElevenLabs: `ELEVENLABS — Voice cloning, text-to-speech, voiceovers

Official documentation (source: elevenlabs.io/docs):

KEY CONCEPTS:
- Priority: Voice selection > Model selection > Voice settings
- Models: Flash v2.5 (75ms latency, fast), Multilingual v2 (highest quality)
- Eleven v3: supports audio event tags in square brackets

VOICE SETTINGS:
- Stability (0-1): Lower = more emotional variation, Higher = more consistent
- Similarity Boost (0-1): How closely output matches the original voice
- Speed (0.7-1.2): Speech pace adjustment

EMOTION/DELIVERY CONTROL:
- v3 supports audio tags: [whispering], [excited], [sad], [laughing], [sighing], [angry]
- Non-speech audio events: [leaves rustling], [footsteps], [applause], [thunder]
- Punctuation matters: exclamation marks add energy, ellipses add hesitation
- Write in narrative style for tone control: "she said excitedly" influences delivery
- SSML break tags for pauses: <break time="1.5s" />

BEST PRACTICES FROM OFFICIAL DOCS:
- Use natural, narrative-style writing to guide tone and pacing
- Specify emotion, pacing, emphasis on specific words
- Describe the context: "podcast intro", "audiobook narration", "product advertisement"
- For voice design prompts: include age, gender, accent, tone, pacing, emotion, quality
  Structure: "[Gender], [Age range], [Accent]. [Character type]. [Emotional tone]. [Delivery style]. [Audio quality]."

EXAMPLE (for Text-to-Speech):
"[excited] Welcome back to another episode of Future Forward! [pause] Today we're diving into something that's going to completely change how you think about productivity. [thoughtful] And trust me... I was skeptical at first too. [building energy] But after testing this for three weeks, I'm absolutely convinced this is the future."

EXAMPLE (for Voice Design):
"Male, late 30s, slight British accent. Warm and authoritative narrator. Calm but engaging delivery with natural pacing. Emphasizes key words subtly. Perfect audio quality, studio recording. Think David Attenborough meets podcast host."`,

  NotebookLM: `NOTEBOOKLM — Documents to podcast-style audio conversations

PROMPT RULES:
- Upload well-structured source documents FIRST
- Better organization of sources = better podcast output
- Supports: PDFs, Google Docs, web links, YouTube videos, audio files
- Audio Overviews: generates ~10 minute podcast-style discussions
- Best for: research summaries, educational content, document analysis
- Free to use

USAGE: Upload 2-5 well-organized documents on the same topic, then click "Generate Audio Overview"`,
};

export const tools: ToolMeta[] = [
  { name: "Suno", icon: "🎵", best_for: "Full AI song generation with vocals", is_free: true, category: "audio_music" },
  { name: "Udio", icon: "🎶", best_for: "Music with custom lyrics, genre flexibility", is_free: true, category: "audio_music" },
  { name: "ElevenLabs", icon: "🎙️", best_for: "Voice cloning, realistic text-to-speech", is_free: true, category: "audio_music" },
  { name: "NotebookLM", icon: "📓", best_for: "Documents to podcast-style audio", is_free: true, category: "audio_music" },
];
