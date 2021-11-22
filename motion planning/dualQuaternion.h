#ifndef __DUALQUATERNION_H__
#define __DUALQUATERNION_H__

#include <stdio.h>
#include "dualNumber.h"
#include "hPoint.h"

class Quaternion		//define a quaternion
{
public:
	Dual dual[4];
	Quaternion *next;

public:
	Quaternion( double re[4], double du[4] );
	Quaternion();

	friend Quaternion operator+( Quaternion&, Quaternion& );
	friend Quaternion operator+( Quaternion&, double );
	friend Quaternion operator+( double, Quaternion& );
	friend Quaternion operator-( Quaternion&, Quaternion& );
	friend Quaternion operator-( Quaternion&, double );
	friend Quaternion operator-( double, Quaternion& );
	friend Quaternion operator*( Quaternion&, Quaternion& );
	friend Quaternion operator*( Quaternion&, hPoint& );
	friend Quaternion operator*( hPoint&, Quaternion& );
	friend Quaternion operator*( Quaternion&, double );
	friend Quaternion operator*( double, Quaternion& );
	friend Quaternion operator*( Quaternion&, Dual& );
	friend Quaternion operator*( Dual&, Quaternion& );
	friend Dual		  operator^( Quaternion&, Quaternion& );	//dot product
	friend Quaternion operator/( Quaternion&, double );
	friend Quaternion operator/( const Quaternion&, const Quaternion& );
	friend Quaternion operator/( double, Quaternion& );
	friend Quaternion operator/( Quaternion&, Dual& );
	Quaternion& operator=( Quaternion );

	void   Clear();		//make all the member of dual 0

	Dual	   Length( );		// calculate the length of a dual quaternion
	Quaternion Inverse( );		//calculate the inverse of a quaternion
	Quaternion Conjugate( );	//calculate the conjuagate of a quaternion
	Quaternion GetReal( );		//create a quaternion from the real part of this quaternion
	Quaternion GetDual( );		//create a quaternion from the dual part of this quaternion
	void Print();
};

#endif