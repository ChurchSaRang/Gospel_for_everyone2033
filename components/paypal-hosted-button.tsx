'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

const PAYPAL_BUTTON_ID = 'SL2BU299G3WE4';
const PAYPAL_CONTAINER_ID = `paypal-container-${PAYPAL_BUTTON_ID}`;
const PAYPAL_SDK_URL = 'https://www.paypal.com/sdk/js?client-id=BAAhlHDA4a4D7xw7T8zVplwI38Hghf6RHHlvDRcpQY6xP10o12bpe8WCAkHpN4iwk3diZPYglP6divpGCQ&components=hosted-buttons&disable-funding=venmo&currency=USD';

type PayPalHostedButtons = {
    HostedButtons: (options: { hostedButtonId: string }) => {
        render: (container: string) => Promise<unknown>;
    };
};

declare global {
    interface Window {
        paypal?: PayPalHostedButtons;
    }
}

export function PayPalHostedButton() {
    const [buttonReady, setButtonReady] = useState(false);
    const [error, setError] = useState('');
    const renderStarted = useRef(false);
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            document.getElementById(PAYPAL_CONTAINER_ID)?.replaceChildren();
        };
    }, []);

    const renderButton = () => {
        if (renderStarted.current) return;
        renderStarted.current = true;
        const container = document.getElementById(PAYPAL_CONTAINER_ID);
        if (!container || !window.paypal?.HostedButtons) {
            setError('The PayPal button could not be loaded. Please try again later.');
            return;
        }

        try {
            window.paypal.HostedButtons({ hostedButtonId: PAYPAL_BUTTON_ID })
                .render(`#${PAYPAL_CONTAINER_ID}`)
                .then(() => {
                    if (mounted.current) setButtonReady(true);
                })
                .catch((renderError: unknown) => {
                    console.error('PayPal hosted support button failed to render:', renderError);
                    if (mounted.current) setError('The PayPal button could not be loaded. Please try again later.');
                });
        } catch (renderError) {
            console.error('PayPal hosted support button failed to render:', renderError);
            setError('The PayPal button could not be loaded. Please try again later.');
        }
    };

    return (
        <div>
            <Script
                id="paypal-hosted-buttons-sdk"
                src={PAYPAL_SDK_URL}
                strategy="afterInteractive"
                onReady={renderButton}
                onError={() => setError('The PayPal service could not be loaded. Please try again later.')}
            />
            <div id={PAYPAL_CONTAINER_ID} />
            {!buttonReady && !error && <p className="mt-3 text-sm text-[#526977]">Loading PayPal...</p>}
            {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        </div>
    );
}
