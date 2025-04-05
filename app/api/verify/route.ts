import { NextResponse } from 'next/server';
import { SelfBackendVerifier, countries } from '@selfxyz/core';

const selfBackendVerifier = new SelfBackendVerifier(
  //'https://forno.celo.org',
  'my-application-scope',
  'https://c85b-111-235-226-130.ngrok-free.app/api/verify'
);

export async function POST(req: Request) {
  try {
    
    const body = await req.json();
    const { proof, publicSignals } = body;

    if (!proof || !publicSignals) {
      return NextResponse.json({ message: 'Proof and publicSignals are required' }, { status: 400 });
    }

    selfBackendVerifier.setMinimumAge(18);
    //selfBackendVerifier.setNationality(countries.TAIWAN);

    const result = await selfBackendVerifier.verify(proof, publicSignals);
    const nationality = result.credentialSubject.nationality;
    
    if (nationality !== countries.TAIWAN) {
      return NextResponse.json({ status: 'error', result: false, message: 'Nationality verification failed' }, { status: 400 });
    }
    console.log("result", result);
    if (result.isValid) {
      return NextResponse.json({ status: 'success', result: true, credentialSubject: result.credentialSubject }, { status: 200 });
    } else {
      return NextResponse.json({ status: 'error', result: false, message: 'Verification failed', details: result.isValidDetails }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying proof:', error);
    return NextResponse.json({ status: 'error', result: false, message: 'Internal server error' }, { status: 500 });
  }
}