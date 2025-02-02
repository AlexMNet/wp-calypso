import { Button, FormLabel } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import { Dispatch, SetStateAction } from 'react';
import FilePicker from 'calypso/components/file-picker';
import FormTextarea from 'calypso/components/forms/form-textarea';

export default function SitesInput( {
	detectedSites,
	setDetectedSites,
	detectedFilename,
	setDetectedFilename,
	handleValidate,
}: {
	detectedSites: string[];
	setDetectedSites: Dispatch< SetStateAction< string[] > >;
	detectedFilename: string;
	setDetectedFilename: Dispatch< SetStateAction< string > >;
	handleValidate: () => void;
} ) {
	const translate = useTranslate();

	let fileReader: any;

	const handleFileRead = () => {
		const sites: string[] = [];
		const content = fileReader.result;
		const lines = content.split( /\r\n|\n/ );
		lines.forEach( ( line: string ) => {
			const fields = line.split( ',' );
			sites.push( fields[ 0 ] );
		} );

		setDetectedSites( sites.filter( ( url ) => url.trim() !== 'url' ) );
	};

	const onFilePick = ( files: File[] ) => {
		fileReader = new FileReader();
		fileReader.onloadend = handleFileRead;
		fileReader.readAsText( files[ 0 ] );
		setDetectedFilename( files[ 0 ].name );
	};

	const onTextareaChange = ( event: any ) =>
		setDetectedSites(
			0 === event.target.value.length
				? []
				: event.target.value
						.split( /,|\n/ )
						.filter( ( url: string ) => url.trim() !== '' )
						.map( ( url: string ) => url.trim() )
		);

	const filePicker = (
		<>
			<div className="connect-url__file-picker-text">{ translate( 'Drop file to upload' ) }</div>
			<div className="connect-url__file-picker-text">{ translate( 'or' ) }</div>
			<div className="connect-url__file-picker-text">
				<Button className="connect-url__file-picker-button">{ translate( 'Select file' ) }</Button>
			</div>
		</>
	);

	const uploadResults = (
		<>
			<FormLabel>{ detectedFilename }</FormLabel>
			<div className="connect-url__file-picker-url-count">
				{ translate( '%(num)d sites detected', { args: { num: detectedSites.length } } ) }
			</div>
		</>
	);

	return (
		<>
			<FormLabel>{ translate( 'Enter site URLs:' ) }</FormLabel>
			<FormTextarea
				className="connect-url__site-urls-field"
				placeholder={ translate( 'E.g.: www.totoros.blog, www.totoro.org' ) }
				onChange={ onTextareaChange }
			></FormTextarea>
			<div className="connect-url__form-instruction">
				{ translate( 'Separate each site with a comma' ) }
			</div>
			<FormLabel>{ translate( 'Or upload a CSV file:' ) }</FormLabel>

			<div className="connect-url__file-picker">
				<FilePicker accept=".csv,.txt" onPick={ onFilePick }>
					{ '' === detectedFilename ? filePicker : uploadResults }
				</FilePicker>
			</div>

			<Button primary disabled={ 0 === detectedSites.length } onClick={ handleValidate }>
				{ 0 === detectedSites.length
					? translate( 'Add sites' )
					: translate( 'Add %(num)d sites', { args: { num: detectedSites.length } } ) }
			</Button>
		</>
	);
}
