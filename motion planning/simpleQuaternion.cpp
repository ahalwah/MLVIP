#include <math.h>
#include <iostream>

#include "simpleQuaternion.h"

using namespace std;

simpleQuaternion::simpleQuaternion()

{
	q[0] = q[1] = q[2] = q[3] = 0.0f;
}

simpleQuaternion::simpleQuaternion(double re[4])
{
	for (int i = 0; i < 4; i++)
		q[i] = re[i];
}

simpleQuaternion::simpleQuaternion(double re1, double re2, double re3, double re4)
{
	q[0] = re1;
	q[1] = re2;
	q[2] = re3;
	q[3] = re4;
}

simpleQuaternion operator+(simpleQuaternion &arg1, simpleQuaternion &arg2)
{
	simpleQuaternion sum;

	for (int i = 0; i < 4; i++)
		sum.q[i] = arg1.q[i] + arg2.q[i];

	return sum;
}

simpleQuaternion operator-(simpleQuaternion &arg1, simpleQuaternion &arg2)
{
	simpleQuaternion diff;

	for (int i = 0; i < 4; i++)
		diff.q[i] = arg1.q[i] - arg2.q[i];

	return diff;
}

double simpleQuaternion::Modulus()
{
	double sum = 0.0;

	for (int i = 0; i < 4; i++)
		sum += q[i] * q[i];

	return sum;
}

simpleQuaternion simpleQuaternion::Conjugate()
{
	simpleQuaternion conju(-q[0], -q[1], -q[2], q[3]);

	return conju;
}
/*
simpleQuaternion simpleQuaternion::Inverse()
{

	return Conjugate() / Modulus();
}
*/
void simpleQuaternion::Print()
{
	for (int i = 0; i < 4; i++)
		cout << q[i] << ' ';
	cout << endl;
}

simpleQuaternion
operator/(simpleQuaternion &arg1, double arg2)
{
	simpleQuaternion division;

	for (int i = 0; i < 4; i++)
		division.q[i] = arg1.q[i] / arg2;

	return division;
}

simpleQuaternion operator*(simpleQuaternion &arg1, simpleQuaternion &arg2)
{
	simpleQuaternion product;

	product.q[0] = arg1.q[3] * arg2.q[0] + arg2.q[3] * arg1.q[0] +
				   arg1.q[1] * arg2.q[2] - arg1.q[2] * arg2.q[1];

	product.q[1] = arg1.q[3] * arg2.q[1] + arg2.q[3] * arg1.q[1] +
				   arg1.q[2] * arg2.q[0] - arg1.q[0] * arg2.q[2];

	product.q[2] = arg1.q[3] * arg2.q[2] + arg2.q[3] * arg1.q[2] +
				   arg1.q[0] * arg2.q[1] - arg1.q[1] * arg2.q[0];

	product.q[3] = arg1.q[3] * arg2.q[3] -
				   (arg1.q[0] * arg2.q[0] + arg1.q[1] * arg2.q[1] + arg1.q[2] * arg2.q[2]);

	return product;
}

simpleQuaternion operator*(double arg1, simpleQuaternion &arg2)
{
	simpleQuaternion product;

	for (int i = 0; i < 4; i++)
		product.q[i] = arg1 * arg2.q[i];

	return product;
}

simpleQuaternion operator*(simpleQuaternion &arg1, double arg2)
{
	simpleQuaternion product;

	for (int i = 0; i < 4; i++)
		product.q[i] = arg2 * arg1.q[i];

	return product;
}

simpleQuaternion &simpleQuaternion::operator=(simpleQuaternion arg1)
{
	for (int i = 0; i < 4; i++)
		q[i] = arg1.q[i];

	return *this;
}

int main()
{
	simpleQuaternion quat1 = {0.89, 0.11, 1.48, -0.16};
	simpleQuaternion quat2 = {-0.5, 1, -1, 0};
	simpleQuaternion result = 2 * quat2;
	result.Print();
	result = quat2 * 2;
	result.Print();
}