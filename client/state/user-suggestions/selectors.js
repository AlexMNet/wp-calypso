import { get } from 'lodash';

import 'calypso/state/user-suggestions/init';

/**
 * Returns true if requesting user suggestions for the specified site ID, or
 * false otherwise.
 * @param  {Object}  state   Global state tree
 * @param  {number}  siteId  Site ID
 * @returns {boolean}         Whether user suggestions are being requested
 */
export function isRequestingUserSuggestions( state, siteId ) {
	return get( state.userSuggestions.requesting, [ siteId ], false );
}

/**
 * Returns the user suggestions for a site.
 * @param  {Object}  state   Global state tree
 * @param  {number}  siteId  Site ID
 * @returns {Array}           Site user suggestions
 */
export function getUserSuggestions( state, siteId ) {
	return get( state.userSuggestions.items, [ siteId ], [] );
}
