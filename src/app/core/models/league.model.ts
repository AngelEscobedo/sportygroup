/** A league as returned by `all_leagues.php` / `lookupleague.php`. */
export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  /** Not returned by `all_leagues.php` on the free tier; available via `lookupleague.php`. */
  strLeagueAlternate?: string | null;
}

export interface Season {
  strSeason: string;
  strBadge: string | null;
}

export interface LeaguesResponse {
  leagues: League[] | null;
}

/** On an invalid id the API returns a message string instead of an array. */
export interface SeasonsResponse {
  seasons: Season[] | string | null;
}
