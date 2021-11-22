#ifndef _SIMPLEQUATERNION_H
#define _SIMPLEQUATERNION_H

class simpleQuaternion
{
public:
	double q[4];

public:
	simpleQuaternion(double re[4]);
	simpleQuaternion(double r1, double r2, double r3, double r4);
	simpleQuaternion();

	friend simpleQuaternion operator+(simpleQuaternion &, simpleQuaternion &);
	friend simpleQuaternion operator-(simpleQuaternion &, simpleQuaternion &);
	friend simpleQuaternion operator*(simpleQuaternion &, simpleQuaternion &);
	friend simpleQuaternion operator*(simpleQuaternion &, double);
	friend simpleQuaternion operator*(double, simpleQuaternion &);
	friend simpleQuaternion operator/(simpleQuaternion &, double);
	simpleQuaternion &operator=(simpleQuaternion);

	double Modulus();
	simpleQuaternion Conjugate();
	simpleQuaternion Inverse();
	void Print();
};

#endif