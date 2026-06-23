export const ROLES = {
    Tank: {
        name: "Tank",
        icon: "/assets/icons/roles/tank.svg"
    },

    Heal: {
        name: "Heal",
        icon: "/assets/icons/roles/heal.svg"
    },

    Rdps: {
        name: "Distance",
        icon: "/assets/icons/roles/rdps.svg"
    },

    Mdps: {
        name: "Mélée",
        icon: "/assets/icons/roles/mdps.svg"
    }
}

export const CLASSES = {
    Guerrier: {
        name: "Guerrier",
        id: 1,
        color: "#C79C6E",
        classIcon: "/assets/icons/classes/Guerrier.webp",
        spells: {
            buffs: ["Cri de commandement"],
            defensifs: ["Cri de ralliement"],
            utilitaires: []
        },
        specs: {
            Fureur: {
                name: "Fureur",
                id: 72,
                specIcon: "/assets/icons/specs/Guerrier_Fureur.jpg",
                role: ROLES.Mdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                },
            },
            Armes: {
                name: "Armes",
                id: 71,
                specIcon: "/assets/icons/specs/Guerrier_Armes.jpg",
                role: ROLES.Mdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                },
            },
            Protection: {
                name: "Protection",
                id: 73,
                specIcon: "/assets/icons/specs/Guerrier_Protection.jpg",
                role: ROLES.Tank,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                },
            }
        }
    },
    Paladin: {
        name: "Paladin",
        id: 2,
        color: "#F48CBA",
        classIcon: "/assets/icons/classes/Paladin.webp",
        spells: {
            buffs: [],
            defensifs: [],
            utilitaires: ["Main de liberté "]
        },
        specs: {
            Sacre: {
                name: "Sacré",
                id: 65,
                specIcon: "/assets/icons/specs/Paladin_Sacré.jpg",
                role: ROLES.Heal,
                spells: {
                    buffs: [],
                    defensifs: ["Maîtrise des auras"],
                    utilitaires: []
                },
            },
            Vindicte: {
                name: "Vindicte",
                id: 70,
                specIcon: "/assets/icons/specs/Paladin_Vindicte.jpg",
                role: ROLES.Mdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                },
            },
            Protection: {
                name: "Protection",
                id: 66,
                specIcon: "/assets/icons/specs/Paladin_Protection.jpg",
                role: ROLES.Tank,
                spells: {
                    buffs: [],
                    defensifs: ["Bénédiction de protection", "Bénédiction de sacrifice", "Bénédiction de protection des sorts"],
                    utilitaires: []
                }
            }
        }
    },
    Chasseur: {
        name: "Chasseur",
        id: 3,
        color: "#AAD372",
        classIcon: "/assets/icons/classes/Chasseur.webp",
        spells: {
                    buffs: ["Marque du chasseur"],
                    defensifs: [],
                    utilitaires: []
                },
        specs: {
            Precision: {
                name: "Précision",
                id: 254,
                specIcon: "/assets/icons/specs/Chasseur_Précision.jpg",
                role: ROLES.Rdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            BM: {
                name: "Maîtrise des bêtes",
                id: 253,
                specIcon: "/assets/icons/specs/Chasseur_Maîtrise des bêtes.jpg",
                role: ROLES.Rdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Survie: {
                name: "Survie",
                id: 255,
                specIcon: "/assets/icons/specs/Chasseur_Survie.jpg",
                role: ROLES.Mdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            }
        }
    },
    Voleur: {
        name: "Voleur",
        id: 4,
        color: "#FFF468",
        classIcon: "/assets/icons/classes/Voleur.webp",
        spells: {
                    buffs: ["Poison atrophiant"],
                    defensifs: [],
                    utilitaires: []
                },
        specs: {
            Outlaw: {
                name: "Hors-la-loi",
                id: 260,
                specIcon: "/assets/icons/specs/Voleur_Hors-la-loi.jpg",
                role: ROLES.Mdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Assassinat: {
                name: "Assassinat",
                id: 259,
                specIcon: "/assets/icons/specs/Voleur_Assassinat.jpg",
                role: ROLES.Mdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Finesse: {
                name: "Finesse",
                id: 261,
                specIcon: "/assets/icons/specs/Voleur_Finesse.jpg",
                role: ROLES.Mdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            }
        }
    },
    Pretre: {
        name: "Prêtre",
        id: 5,
        color: "#FFFFFF",
        classIcon: "/assets/icons/classes/Prêtre.webp",
        spells: {
                    buffs: ["Mot de pouvoir : Robustesse"],
                    defensifs: [],
                    utilitaires: ["Dissipation de masse", "Saut de foi"]
                },
        specs: {
            Ombre: {
                name: "Ombre",
                id: 258,
                specIcon: "/assets/icons/specs/Prêtre_Ombre.jpg",
                role: ROLES.Rdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Sacre: {
                name: "Sacré",
                id: 257,
                specIcon: "/assets/icons/specs/Prêtre_Sacré.jpg",
                role: ROLES.Heal,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Discipline: {
                name: "Discipline",
                id: 256,
                specIcon: "/assets/icons/specs/Prêtre_Discipline.jpg",
                role: ROLES.Heal,
                spells: {
                    buffs: [],
                    defensifs: ["Mot de pouvoir : Barrière"],
                    utilitaires: []
                }
            }
        }
    },
    DK: {
        name: "Chevalier de la mort",
        id: 6,
        color: "#C41E3A",
        classIcon: "/assets/icons/classes/Chevalier de la mort.webp",
        spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: ["Poigne de la mort"]
                },
        specs: {
            Givre: {
                name: "Givre",
                id: 251,
                specIcon: "/assets/icons/specs/Chevalier de la mort_Givre.jpg",
                role: ROLES.Mdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Impie: {
                name: "Impie",
                id: 252,
                specIcon: "/assets/icons/specs/Chevalier de la mort_Impie.jpg",
                role: ROLES.Mdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Sang: {
                name: "Sang",
                id: 250,
                specIcon: "/assets/icons/specs/Chevalier de la mort_Sang.jpg",
                role: ROLES.Tank,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: ["Emprise de Fielsang"]
                }
            }
        }
    },
    Chaman: {
        name: "Chaman",
        id: 7,
        color: "#0070DD",
        classIcon: "/assets/icons/classes/Chaman.webp",
        spells: {
                    buffs: ["Fureur du ciel"],
                    defensifs: [],
                    utilitaires: []
                },
        specs: {
            Amelioration: {
                name: "Amélioration",
                id: 263,
                specIcon: "/assets/icons/specs/Chaman_Amélioration.jpg",
                role: ROLES.Mdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Elementaire: {
                name: "Élémentaire",
                id: 262,
                specIcon: "/assets/icons/specs/Chaman_Élémentaire.jpg",
                role: ROLES.Rdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Restauration: {
                name: "Restauration",
                id: 264,
                specIcon: "/assets/icons/specs/Chaman_Restauration.jpg",
                role: ROLES.Heal,
                spells: {
                    buffs: [],
                    defensifs: ["Totem de lien d'esprits"],
                    utilitaires: []
                }
            }
        }
    },
    Mage: {
        name: "Mage",
        id: 8,
        color: "#3FC7EB",
        classIcon: "/assets/icons/classes/Mage.webp",
        spells: {
                    buffs: ["Intelligence des Arcanes"],
                    defensifs: [],
                    utilitaires: []
                },
        specs: {
            Givre: {
                name: "Givre",
                id: 62,
                specIcon: "/assets/icons/specs/Mage_Givre.jpg",
                role: ROLES.Rdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Feu: {
                name: "Feu",
                id: 63,
                specIcon: "/assets/icons/specs/Mage_Feu.jpg",
                role: ROLES.Rdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Arcanes: {
                name: "Arcanes",
                id: 64,
                specIcon: "/assets/icons/specs/Mage_Arcanes.jpg",
                role: ROLES.Rdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            }
        }
    },
    Demoniste: {
        name: "Démoniste",
        id: 9,
        color: "#8788EE",
        classIcon: "/assets/icons/classes/Démoniste.webp",
        spells: {
                    buffs: [],
                    defensifs: ["Pierre de soins"],
                    utilitaires: ["Porte des démons"]
                },
        specs: {
            Affliction: {
                name: "Affliction",
                id: 265,
                specIcon: "/assets/icons/specs/Démoniste_Affliction.jpg",
                role: ROLES.Rdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Destruction: {
                name: "Destruction",
                id: 267,
                specIcon: "/assets/icons/specs/Démoniste_Destruction.jpg",
                role: ROLES.Rdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Démonologie: {
                name: "Démonologie",
                id: 266,
                specIcon: "/assets/icons/specs/Démoniste_Démonologie.jpg",
                role: ROLES.Rdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            }
        }
    },
    Moine: {
        name: "Moine",
        id: 10,
        color: "#00FF98",
        classIcon: "/assets/icons/classes/Moine.webp",
        spells: {
                    buffs: ["Toucher mystique"],
                    defensifs: [],
                    utilitaires: ["Anneau de paix"]
                },
        specs: {
            BrewM: {
                name: "Maître brasseur",
                id: 268,
                specIcon: "/assets/icons/specs/Moine_Maître brasseur.jpg",
                role: ROLES.Tank,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            MistW: {
                name: "Tisse-brume",
                id: 270,
                specIcon: "/assets/icons/specs/Moine_Tisse-brume.jpg",
                role: ROLES.Heal,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            WW: {
                name: "Marche-vent",
                id: 269,
                specIcon: "/assets/icons/specs/Moine_Marche-vent.jpg",
                role: ROLES.Mdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            }
        }
    },
    Druide: {
        name: "Druide",
        id: 11,
        color: "#FF7C0A",
        classIcon: "/assets/icons/classes/Druide.webp",
        spells: {
                    buffs: ["Marque de la nature"],
                    defensifs: [],
                    utilitaires: ["Ruée rugissante", "Ursol", "Typhon", "Innervation"]
                },
        specs: {
            Gardien: {
                name: "Gardien",
                id: 104,
                specIcon: "/assets/icons/specs/Druide_Gardien.jpg",
                role: ROLES.Tank,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Restauration: {
                name: "Restauration",
                id: 105,
                specIcon: "/assets/icons/specs/Druide_Restauration.jpg",
                role: ROLES.Heal,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Farouche: {
                name: "Farouche",
                id: 103,
                specIcon: "/assets/icons/specs/Druide_Farouche.jpg",
                role: ROLES.Mdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Equilibre: {
                name: "Équilibre",
                id: 102,
                specIcon: "/assets/icons/specs/Druide_Équilibre.jpg",
                role: ROLES.Rdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            }
        }
    },
    DH: {
        name: "Chasseur de démons",
        id: 12,
        color: "#A330C9",
        classIcon: "/assets/icons/classes/Chasseur de démons.webp",
        spells: {
                    buffs: ["Marque du chaos"],
                    defensifs: ["Ténèbres"],
                    utilitaires: []
                },
        specs: {
            Vengeance: {
                name: "Vengeance",
                id: 581,
                specIcon: "/assets/icons/specs/Chasseur de démons_Vengeance.jpg",
                role: ROLES.Tank,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Devastation: {
                name: "Dévastation",
                id: 577,
                specIcon: "/assets/icons/specs/Chasseur de démons_Dévastation.jpg",
                role: ROLES.Mdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Devoration: {
                name: "Dévoration",
                id: 1480,
                specIcon: "/assets/icons/specs/Chasseur de démons_Dévoration.png",
                role: ROLES.Rdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            }
        }
    },
    Evocateur: {
        name: "Évocateur",
        id: 13,
        color: "#33937F",
        classIcon: "/assets/icons/classes/Évocateur.webp",
        spells: {
                    buffs: ["Bénédiction du bronze"],
                    defensifs: ["Zephyr", "Secourir"],
                    utilitaires: []
                },
        specs: {
            Augmentation: {
                name: "Augmentation",
                id: 1473,
                specIcon: "/assets/icons/specs/Évocateur_Augmentation.jpg",
                role: ROLES.Rdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Preservation: {
                name: "Préservation",
                id: 1468,
                specIcon: "/assets/icons/specs/Évocateur_Préservation.jpg",
                role: ROLES.Heal,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            },
            Devastation: {
                name: "Dévastation",
                id: 1467,
                specIcon: "/assets/icons/specs/Évocateur_Dévastation.jpg",
                role: ROLES.Rdps,
                spells: {
                    buffs: [],
                    defensifs: [],
                    utilitaires: []
                }
            }
        }
    }

}