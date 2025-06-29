/**
 * @module Members
 */
import { WithId } from 'mongodb';
import { PatronTier } from 'v1/types/PatreonTier';

/**
 * This is a type of a single object within the collection "patrons".
 * A single object describes a single patron.
 */
export type Patron = WithId<{
  /**
   * Steam ID of the patron.
   */
  memberId: string;
  /**
   * Patron tier.
   */
  tier: PatronTier;
  /**
   * Username of the patron (used when a patron is not curator member).
   */
  username: string | null;
  /**
   * Link to the avatar of the patron (used when a patron is not curator member).
   */
  avatar: string | null;
  /**
   * Patron identifier of a user.
   */
  patronId: string | null;
}>;
