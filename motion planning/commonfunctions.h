#ifndef __COMMONFUNCTIONS_H__
#define __COMMONFUNCTIONS_H__

#include <stdio.h>
#include <vector>

#include "hPoint.h"
#include "hMatrix.h"


// calculate C(n i)*(1-t)^(n-i)*t^i
extern double Binomial( int n, int i, double t );

// calculate C(n i)
extern double Binomial( int n, int i );


#endif
