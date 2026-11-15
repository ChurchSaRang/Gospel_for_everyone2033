import { Country } from 'country-state-city';
import { NextResponse } from 'next/server';

export function GET() {
    const countries = Country.getAllCountries()
        .map(({ isoCode, name }) => ({ code: isoCode, name }))
        .sort((left, right) => left.name.localeCompare(right.name));

    return NextResponse.json({ data: countries });
}