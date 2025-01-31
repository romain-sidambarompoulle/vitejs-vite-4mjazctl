export interface BNCSimulation {
  remuneration_avant_impot: number;
  cotisations: number;
  contribution: number;
  revenu_net_apres_impot: number;
  impot_revenu: number;
  epargne_disponible: number;
}

export interface ODIASimulation {
  revenu_bnc: number;
  cotisations: number;
  contribution: number;
  revenu_apres_impot_perso: number;
  impot_societes: number;
  epargne_disponible_perso: number;
  revenu_apres_impot_investir: number;
  total_revenu: number;
  performance_montage: number;
  capital_revenu_15ans: number;
  interets_mensuels_15ans: number;
}

export interface SimulationResult {
  simulation_bnc: BNCSimulation;
  simulation_odia: ODIASimulation;
}