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
  waiting_wins_asked: {
    name: "waiting_wins_asked",
    number: 2,
  },
  waiting_card_throw: {
    name: "waiting_card_throw",
    number: 3,
  },
  finished: {
    name: "finished",
    number: 4,
  },
};
