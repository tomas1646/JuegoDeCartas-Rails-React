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
  player1_win: {
    name: "player1_win",
    number: 3,
  },
  player2_win: {
    name: "player2_win",
    number: 4,
  },
  player3_win: {
    name: "player3_win",
    number: 5,
  },
  player4_win: {
    name: "player4_win",
    number: 6,
  },
};

export const RoundStatus: Record<string, EnumData> = {
  waiting_wins_asked: {
    name: "waiting_wins_asked",
    number: 0,
  },
  waiting_card_throw: {
    name: "waiting_card_throw",
    number: 1,
  },
};
