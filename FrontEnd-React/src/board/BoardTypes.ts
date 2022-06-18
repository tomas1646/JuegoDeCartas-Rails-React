interface EnumData {
  name: string;
  number: number;
}

export const BoardStatus: Record<string, EnumData> = {
  waiting_players: {
    name: "waiting_players",
    number: 0,
  },
  full: {
    name: "full",
    number: 1,
  },
  in_course: {
    name: "in_course",
    number: 2,
  },
  player_1_win: {
    name: "player_1_win",
    number: 3,
  },
  player_2_win: {
    name: "player_2_win",
    number: 4,
  },
  player_3_win: {
    name: "player_3_win",
    number: 5,
  },
  player_4_win: {
    name: "player_4_win",
    number: 6,
  },
};

export const RoundStatus: Record<string, EnumData> = {
  dealing: {
    name: "dealing",
    number: 0,
  },
  waiting_wins_asked: {
    name: "waiting_wins_asked",
    number: 1,
  },
  waiting_card_throw: {
    name: "waiting_card_throw",
    number: 2,
  },
  round_finished: {
    name: "round_finished",
    number: 3,
  },
};
