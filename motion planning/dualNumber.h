// dualnumber.h defines operations of a dual number

#ifndef __DUALNUMBER_H__
#define __DUALNUMBER_H__

class Dual
{
protected:
	double real;
	double dual;

public:
	Dual() { real = 1.0f; dual = 0.0f; } //changed default value to 1.0 for real part and 0.0 for dual
	Dual( double re ) { real = re; dual = 0.0; };
	Dual( double re, double du ) { real = re; dual = du; }

	void   SetupDual( double, double );
	void   SetupDual( Dual& );
	void   SetReal( double r ) { real = r; }
	void   SetDual( double d ) { dual = d; }
	double GetReal() { return real; }
	double GetDual() { return dual; }

	friend Dual operator+( const Dual&, const Dual& );
	friend Dual operator+( const Dual&, double );
	friend Dual operator+( double, const Dual& );
	friend Dual operator-( const Dual&, const Dual& );
	friend Dual operator-( const Dual&, double );
	friend Dual operator-( double, const Dual& );
	friend Dual operator*( const Dual&, const Dual& );
	friend Dual operator*( double, const Dual& );
	friend Dual operator*( const Dual&, double );
	friend Dual operator/( const Dual&, const Dual& );
	friend Dual operator/( const Dual&, double );
	friend Dual operator/( double, const Dual& );
	Dual& operator=( Dual );
};

#endif
