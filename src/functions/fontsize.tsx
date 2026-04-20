/**
 * Font Size & Typography System
 * Centralized source of truth for all text styles in the application.
 */

// Internal Style Definitions (Revised: 18px, 16px, 14px)
const BLACK_18 = "text-[18px] font-black";
const BLACK_16 = "text-[16px] font-black";
const BOLD_16 = "text-[16px] font-bold";
const BOLD_14 = "text-[14px] font-bold";
const BLACK_14 = "text-[14px] font-black";
const REGULAR_16 = "text-[16px] font-medium";
const REGULAR_15 = "text-[15px] font-medium";
const REGULAR_14 = "text-[14px] font-medium";

export const FONT = {
  // 18px: Big Headings
  H1: BLACK_18,
  H2: BLACK_18,
  H3: BLACK_18,
  
  // 16px: Sub-headings & Highlighted text
  H4: BLACK_16,
  H5: BLACK_16,
  BODY_LG: BOLD_16,
  
  // 14px: Options, Labels, Buttons, and Minor text
  BODY_MD: BOLD_14,
  BODY_SM: BOLD_14,
  LABEL_LG: BOLD_14,
  LABEL: BOLD_14,
  LABEL_SM: BOLD_14,
  CAPTION: BOLD_14,
  MICRO: BOLD_14,
  NANO: BOLD_14,
  
  // 14px/16px Regular Variants
  BODY_REG: REGULAR_14,
  LABEL_REG: REGULAR_14,
  DATA_REG: REGULAR_14,
  INFO_REG: REGULAR_14,
  BODY_LG_REG: REGULAR_16,
  STUDENT_NAME: REGULAR_15,
  
  // 14px Black Variants
  LABEL_BLACK: BLACK_14,
  LABEL_SM_BLACK: BLACK_14,
  CAPTION_BLACK: BLACK_14,
  MICRO_BLACK: BLACK_14,
  NANO_BLACK: BLACK_14,
};

// Helper for grouping related styles (Semantic groupings)
export const TEXT = {
  TITLE: `text-slate-900 ${FONT.H5} tracking-tight`, // Keep tight for headings only
  SUBTITLE: `text-slate-900 ${FONT.LABEL} uppercase`,
  MENU: `text-slate-900 ${FONT.LABEL_LG} font-bold`,
  CARD_TITLE: `text-slate-900 ${FONT.BODY_LG} font-black`,
  NAV_ITEM: `text-slate-900 ${FONT.BODY_SM} font-bold`,
};
