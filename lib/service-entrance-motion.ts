export const serviceEntranceTransition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
}

export const serviceEntranceVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 56 },
  visible: { opacity: 1, scale: 1, y: 0 },
} as const

export const serviceEntranceContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
} as const

export const serviceEntranceItemVariants = {
  hidden: serviceEntranceVariants.hidden,
  visible: {
    ...serviceEntranceVariants.visible,
    transition: serviceEntranceTransition,
  },
} as const
