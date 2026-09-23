const SPORT_ICONS: Record<string, string> = {
  soccer: 'sports_soccer',
  basketball: 'sports_basketball',
  motorsport: 'sports_motorsports',
  'american football': 'sports_football',
  baseball: 'sports_baseball',
  'ice hockey': 'sports_hockey',
  tennis: 'sports_tennis',
  rugby: 'sports_rugby',
  cricket: 'sports_cricket',
  golf: 'sports_golf',
  volleyball: 'sports_volleyball',
  handball: 'sports_handball',
  fighting: 'sports_mma',
  esports: 'sports_esports',
};

/** Material Symbols icon name for a sport, with a generic fallback. */
export function sportIcon(sport: string): string {
  return SPORT_ICONS[sport.trim().toLowerCase()] ?? 'emoji_events';
}
