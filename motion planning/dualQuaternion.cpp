#include <math.h>

#include "dualQuaternion.h"
#include <iostream>
#include <vector>

using namespace std;

Quaternion::Quaternion()
{
	for (int i = 0; i < 4; i++)
		dual[i].SetupDual(0.0f, 0.0f);
}

Quaternion::Quaternion(double re[4], double du[4])
{
	for (int i = 0; i < 4; i++)
		dual[i].SetupDual(re[i], du[i]);
}

Dual operator^(Quaternion &arg1, Quaternion &arg2)
{
	Dual res;

	for (int i = 0; i < 4; i++)
		res = res + arg1.dual[i] * arg2.dual[i];

	return res;
}

Quaternion operator+(Quaternion &arg1, Quaternion &arg2)
{
	Quaternion sum;

	for (int i = 0; i < 4; i++)
		sum.dual[i] = arg1.dual[i] + arg2.dual[i];

	return sum;
}

Quaternion operator+(Quaternion &arg1, double arg2)
{
	Quaternion res;

	for (int i = 0; i < 3; i++)
		res.dual[i].SetupDual(arg1.dual[i].GetReal(), arg1.dual[i].GetDual());

	res.dual[3].SetupDual(arg1.dual[3].GetReal() + arg2, arg1.dual[3].GetDual());

	return res;
}

Quaternion operator+(double arg1, Quaternion &arg2)
{
	Quaternion res;

	for (int i = 0; i < 3; i++)
		res.dual[i].SetupDual(arg2.dual[i].GetReal(), arg2.dual[i].GetDual());

	res.dual[3].SetupDual(arg2.dual[3].GetReal() + arg1, arg2.dual[3].GetDual());

	return res;
}

Quaternion operator-(Quaternion &arg1, Quaternion &arg2)
{
	Quaternion sum;

	for (int i = 0; i < 4; i++)
		sum.dual[i] = arg1.dual[i] - arg2.dual[i];

	return sum;
}

Quaternion operator-(Quaternion &arg1, double arg2)
{
	Quaternion res;

	for (int i = 0; i < 3; i++)
		res.dual[i].SetupDual(arg1.dual[i].GetReal(), arg1.dual[i].GetDual());

	res.dual[3].SetupDual(arg1.dual[3].GetReal() - arg2, arg1.dual[3].GetDual());

	return res;
}

Quaternion operator-(double arg1, Quaternion &arg2)
{
	Quaternion res;

	for (int i = 0; i < 3; i++)
		res.dual[i].SetupDual(arg2.dual[i].GetReal(), arg2.dual[i].GetDual());

	res.dual[3].SetupDual(arg2.dual[3].GetReal() - arg1, arg2.dual[3].GetDual());

	return res;
}

Quaternion operator*(Quaternion &arg1, Quaternion &arg2)
{
	Quaternion mul;

	mul.dual[0] = arg1.dual[3] * arg2.dual[0] + arg1.dual[0] * arg2.dual[3] + arg1.dual[1] * arg2.dual[2] - arg1.dual[2] * arg2.dual[1];

	mul.dual[1] = arg1.dual[3] * arg2.dual[1] + arg1.dual[1] * arg2.dual[3] + arg1.dual[2] * arg2.dual[0] - arg1.dual[0] * arg2.dual[2];

	mul.dual[2] = arg1.dual[3] * arg2.dual[2] + arg1.dual[2] * arg2.dual[3] + arg1.dual[0] * arg2.dual[1] - arg1.dual[1] * arg2.dual[0];

	mul.dual[3] = arg1.dual[3] * arg2.dual[3] - arg1.dual[0] * arg2.dual[0] - arg1.dual[1] * arg2.dual[1] - arg1.dual[2] * arg2.dual[2];

	return mul;
}

Quaternion &Quaternion::operator=(Quaternion arg1)
{
	for (int i = 0; i < 4; i++)
		dual[i].SetupDual(arg1.dual[i].GetReal(), arg1.dual[i].GetDual());

	return *this;
}

Dual Quaternion::Length()
{
	Dual sum, res;
	double r, d;

	for (int i = 0; i < 4; i++)
		sum = sum + dual[i] * dual[i];

	r = sqrt(sum.GetReal());
	d = sum.GetDual() / r / 2.0f;

	res.SetupDual(r, d);

	return res;
}

Quaternion Quaternion::Conjugate()
{
	Quaternion conju;

	for (int i = 0; i < 3; i++)
		conju.dual[i].SetupDual(-dual[i].GetReal(), -dual[i].GetDual());
	conju.dual[3].SetupDual(dual[3].GetReal(), dual[3].GetDual());

	return conju;
}
/*
Quaternion Quaternion::Inverse()
{
	return Conjugate() / Length() / Length();
}
*/
Quaternion Quaternion::GetReal()
{
	Quaternion getreal;

	for (int i = 0; i < 4; i++)
		getreal.dual[i].SetupDual(dual[i].GetReal(), 0.0f);

	return getreal;
}

Quaternion Quaternion::GetDual()
{
	Quaternion getdual;

	for (int i = 0; i < 4; i++)
		getdual.dual[i].SetupDual(dual[i].GetDual(), 0.0f);

	return getdual;
}

void Quaternion::Print()
{
	FILE *fp = fopen("Quat.dat", "a+");

	for (int i = 0; i < 4; i++)
	{
		fprintf(fp, "%lf  ", dual[i].GetReal());
		fprintf(fp, " dual:%lf\n", dual[i].GetDual());
	}

	fprintf(fp, "\n");
}

void Quaternion::Clear()
{
	for (int i = 0; i < 4; i++)
		dual[i].SetupDual(0.0f, 0.0f);

	return;
}

Quaternion operator*(Quaternion &arg1, double arg2)
{
	Quaternion mul;

	for (int i = 0; i < 4; i++)
		mul.dual[i].SetupDual(arg1.dual[i].GetReal() * arg2, arg1.dual[i].GetDual() * arg2);

	return mul;
}

Quaternion operator*(double arg1, Quaternion &arg2)
{
	Quaternion mul;

	for (int i = 0; i < 4; i++)
		mul.dual[i].SetupDual(arg2.dual[i].GetReal() * arg1, arg2.dual[i].GetDual() * arg1);

	return mul;
}
/*
Quaternion operator*(Dual &arg1, Quaternion &arg2)
{
	Quaternion mul;

	for (int i = 0; i < 4; i++)
		mul.dual[i].SetupDual(arg2.dual[i] * arg1);

	return mul;
}

Quaternion operator*(Quaternion &arg1, Dual &arg2)
{
	Quaternion mul;

	for (int i = 0; i < 4; i++)
		mul.dual[i].SetupDual(arg1.dual[i] * arg2);

	return mul;
}
*/
Quaternion operator/(Quaternion &arg1, double arg2)
{
	Quaternion div;

	for (int i = 0; i < 4; i++)
		div.dual[i].SetupDual(arg1.dual[i].GetReal() / arg2, arg1.dual[i].GetDual() / arg2);

	return div;
}

Quaternion operator/(Quaternion &arg1, Quaternion &arg2)
{
	double deno = 0.0f;
	Quaternion res;

	for (int i = 0; i < 4; i++)
		deno += (arg2.dual[i] * arg2.dual[i]).GetReal();

	res.dual[0] = (arg1.dual[0] * arg2.dual[3] - arg1.dual[3] * arg2.dual[0] + arg1.dual[2] * arg2.dual[1] - arg1.dual[1] * arg2.dual[2]) / deno;
	res.dual[1] = (arg1.dual[1] * arg2.dual[3] - arg1.dual[3] * arg2.dual[1] + arg1.dual[0] * arg2.dual[2] - arg1.dual[2] * arg2.dual[0]) / deno;
	res.dual[2] = (arg1.dual[2] * arg2.dual[3] - arg1.dual[3] * arg2.dual[2] + arg1.dual[1] * arg2.dual[0] - arg1.dual[0] * arg2.dual[1]) / deno;
	res.dual[3] = (arg1.dual[0] * arg2.dual[0] + arg1.dual[1] * arg2.dual[1] + arg1.dual[2] * arg2.dual[2] + arg1.dual[3] * arg2.dual[3]) / deno;

	return res;
}

Quaternion operator/(double arg1, Quaternion &arg2)
{
	Quaternion q;

	for (int i = 0; i < 3; i++)
		q.dual[i].SetupDual(0.0f, 0.0f);
	q.dual[3].SetupDual(arg1, 0.0f);

	return q / arg2;
}
/*
Quaternion operator/(Quaternion &arg1, Dual &arg2)
{
	return arg1 * (1.0f / arg2);
}
*/
Quaternion operator*(Quaternion &arg1, hPoint &arg2)
{
	Quaternion mul;

	mul.dual[0] = arg1.dual[3] * arg2.coord[0] + arg1.dual[0] * arg2.coord[3] + arg1.dual[1] * arg2.coord[2] - arg1.dual[2] * arg2.coord[1];

	mul.dual[1] = arg1.dual[3] * arg2.coord[1] + arg1.dual[1] * arg2.coord[3] + arg1.dual[2] * arg2.coord[0] - arg1.dual[0] * arg2.coord[2];

	mul.dual[2] = arg1.dual[3] * arg2.coord[2] + arg1.dual[2] * arg2.coord[3] + arg1.dual[0] * arg2.coord[1] - arg1.dual[1] * arg2.coord[0];

	mul.dual[3] = arg1.dual[3] * arg2.coord[3] - arg1.dual[0] * arg2.coord[0] - arg1.dual[1] * arg2.coord[1] - arg1.dual[2] * arg2.coord[2];

	return mul;
}

Quaternion operator*(hPoint &arg1, Quaternion &arg2)
{
	Quaternion mul;

	mul.dual[0] = arg1.coord[3] * arg2.dual[0] + arg1.coord[0] * arg2.dual[3] + arg1.coord[1] * arg2.dual[2] - arg1.coord[2] * arg2.dual[1];

	mul.dual[1] = arg1.coord[3] * arg2.dual[1] + arg1.coord[1] * arg2.dual[3] + arg1.coord[2] * arg2.dual[0] - arg1.coord[0] * arg2.dual[2];

	mul.dual[2] = arg1.coord[3] * arg2.dual[2] + arg1.coord[2] * arg2.dual[3] + arg1.coord[0] * arg2.dual[1] - arg1.coord[1] * arg2.dual[0];

	mul.dual[3] = arg1.coord[3] * arg2.dual[3] - arg1.coord[0] * arg2.dual[0] - arg1.coord[1] * arg2.dual[1] - arg1.coord[2] * arg2.dual[2];

	return mul;
}

int main()
{
	double r1[4] = {1.1, 1.3, 1.5, 1.4};
	double d1[4] = {0.8, 0.5, 1.3, 0.9};
	Quaternion q1(r1, d1);
	cout << typeid(q1.GetReal()).name() << endl;
}