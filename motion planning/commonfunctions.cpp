#include <iostream>

#include "commonFunctions.h"


double Binomial( int n, int i, double t )
{
	double result = 1.0f, temp = 1.0f;

	if( i != 0 )
	{
		for( int j = 1; j <= n; j ++ )		result *= j;    // n!
	
		for(int j = 1; j <= n-i; j ++ )		temp *= j;		// (n-i)!

		result /= temp;
	
		temp = 1.0f;
		for(int j = 1; j <= i; j ++ )			temp *= j;       // i!

		result /= temp;

		temp = 1.0f;
	}
	else
		result = 1.0f;

	for( int j = 1; j <= n-i; j ++ )
		temp *= 1-t;     // (1-t)^(n-i)

	for(int j = 1; j <= i; j ++ )
		temp *= t;		 // (1-t)^(n-i)*t^i

	result *= temp;

	return result;
}

double Binomial( int n, int i )
{
	double result = 1.0f, temp = 1.0f;

	if( i != 0 )
	{
		for( int j = 1; j <= n; j ++ )		result *= j;    // n!
	
		for(int j = 1; j <= n-i; j ++ )		temp *= j;		// (n-i)!

		result /= temp;
	
		temp = 1.0f;
		for(int j = 1; j <= i; j ++ )			temp *= j;       // i!

		result /= temp;
	}
	else
		result = 1.0f;

	return result;
}

