/** Frame paths served from /public/hero-animation */

export const BOY_FRAMES = [
  "/hero-animation/boy/boy_frame_021.webp",
  "/hero-animation/boy/boy_frame_023.webp",
  "/hero-animation/boy/boy_frame_025.webp",
  "/hero-animation/boy/boy_frame_027.webp",
  "/hero-animation/boy/boy_frame_029.webp",
  "/hero-animation/boy/boy_frame_031.webp",
  "/hero-animation/boy/boy_frame_033.webp",
  "/hero-animation/boy/boy_frame_035.webp",
  "/hero-animation/boy/boy_frame_037.webp",
  "/hero-animation/boy/boy_frame_039.webp",
] as const;

export const GIRL_FRAMES = [
  "/hero-animation/girl/girl_frame_017.webp",
  "/hero-animation/girl/girl_frame_019.webp",
  "/hero-animation/girl/girl_frame_021.webp",
  "/hero-animation/girl/girl_frame_023.webp",
  "/hero-animation/girl/girl_frame_025.webp",
  "/hero-animation/girl/girl_frame_027.webp",
  "/hero-animation/girl/girl_frame_029.webp",
  "/hero-animation/girl/girl_frame_031.webp",
  "/hero-animation/girl/girl_frame_033.webp",
  "/hero-animation/girl/girl_frame_035.webp",
  "/hero-animation/girl/girl_frame_037.webp",
] as const;

export const TEACHER_FRAMES = [
  "/hero-animation/teacher/teacher_frame_001.webp",
  "/hero-animation/teacher/teacher_frame_003.webp",
  "/hero-animation/teacher/teacher_frame_005.webp",
  "/hero-animation/teacher/teacher_frame_007.webp",
  "/hero-animation/teacher/teacher_frame_009.webp",
  "/hero-animation/teacher/teacher_frame_011.webp",
  "/hero-animation/teacher/teacher_frame_013.webp",
  "/hero-animation/teacher/teacher_frame_015.webp",
  "/hero-animation/teacher/teacher_frame_017.webp",
  "/hero-animation/teacher/teacher_frame_019.webp",
  "/hero-animation/teacher/teacher_frame_021.webp",
  "/hero-animation/teacher/teacher_frame_023.webp",
  "/hero-animation/teacher/teacher_frame_025.webp",
] as const;

/** ms per frame — lower = faster */
export const HERO_FRAME_MS = {
  boy: 110,
  girl: 125,
  teacher: 140,
} as const;
