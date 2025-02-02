import { addQueryArgs, getQueryArgs, removeQueryArgs } from '@wordpress/url';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useProductsQuery from 'calypso/state/partner-portal/licenses/hooks/use-products-query';
import { APIProductFamilyProduct } from 'calypso/state/partner-portal/types';

const BUNDLE_SIZE_PARAM_KEY = 'bundle_size';

// Parse the location hash to get the selected product bundle size
// If the hash is not found, return the default size (1)
const parseLocationHash = ( supportedBundleSizes: number[], value: string ) => {
	return supportedBundleSizes.find( ( size ) => value === `${ size }` ) || 1;
};

export const getSupportedBundleSizes = ( products?: APIProductFamilyProduct[] ) => {
	if ( ! products ) {
		return [ 1 ];
	}

	const supported = new Set( [
		1,
		...products.flatMap( ( p ) => p.supported_bundles?.map( ( { quantity } ) => quantity ) ),
	] );

	return [ ...supported ];
};

export function useProductBundleSize() {
	const { data: products } = useProductsQuery();

	const supportedBundleSizes = getSupportedBundleSizes( products );

	const [ selectedSize, setSelectedSize ] = useState< number | undefined >( undefined );

	// When products are changed, we need to reevaluate if selected bundle size is still valid
	useEffect( () => {
		const { [ BUNDLE_SIZE_PARAM_KEY ]: bundleSize } = getQueryArgs( window.location.href );
		setSelectedSize( parseLocationHash( supportedBundleSizes, bundleSize?.toString() ) );
	}, [ supportedBundleSizes ] );

	const setSelectedSizeAndLocationHash = useCallback(
		( size: number ) => {
			if ( size === selectedSize ) {
				return;
			}

			const queryArgs =
				size === 1
					? removeQueryArgs( window.location.href, BUNDLE_SIZE_PARAM_KEY )
					: addQueryArgs( window.location.href, {
							...getQueryArgs( window.location.href ),
							[ BUNDLE_SIZE_PARAM_KEY ]: `${ size }`,
					  } );

			window.history.pushState( null, '', queryArgs );

			setSelectedSize( size );
		},
		[ selectedSize ]
	);

	return useMemo( () => {
		return {
			selectedSize: selectedSize ?? 1,
			setSelectedSize: setSelectedSizeAndLocationHash,
			availableSizes: supportedBundleSizes,
			fetchingAvailableSizes: ! selectedSize, // We know we are still fetching if our selected size is undefined.
		};
	}, [ selectedSize, setSelectedSizeAndLocationHash, supportedBundleSizes ] );
}
