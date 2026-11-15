import { Country, State } from 'country-state-city';
import { NextResponse } from 'next/server';

export function GET(request: Request) {
    const countryCode = new URL(request.url).searchParams.get('country');
    if (!countryCode || !Country.getCountryByCode(countryCode)) {
        return NextResponse.json({ message: 'A valid country code is required.' }, { status: 400 });
    }

    const regions = State.getStatesOfCountry(countryCode)
        .map(({ isoCode, name }) => ({ code: isoCode, name }))
        .sort((left, right) => left.name.localeCompare(right.name));

    return NextResponse.json({ data: regions });
}