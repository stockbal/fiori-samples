sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'bpmanager/test/integration/FirstJourney',
		'bpmanager/test/integration/pages/BusinessPartnersList',
		'bpmanager/test/integration/pages/BusinessPartnersObjectPage'
    ],
    function(JourneyRunner, opaJourney, BusinessPartnersList, BusinessPartnersObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('bpmanager') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBusinessPartnersList: BusinessPartnersList,
					onTheBusinessPartnersObjectPage: BusinessPartnersObjectPage
                }
            },
            opaJourney.run
        );
    }
);