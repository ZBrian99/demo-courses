import React, { useMemo } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { Payment } from '../../types/enrollmentsTypes';

interface PaymentCellProps {
    payments: Payment[];
}

const currencyDetails: Record<string, { symbol: string; description: string }> = {
    ARS: { symbol: '$', description: 'Pesos argentinos' },
  USD: { symbol: '$', description: 'Dólares estadounidenses' },
     	CLP: { symbol: '$', description: 'Pesos chilenos' },
 	BRL: { symbol: 'R$', description: 'Reales brasileños' },
 	COP: { symbol: '$', description: 'Pesos colombianos' },
 	CUP: { symbol: '$', description: 'Pesos cubanos' },
 	EUR: { symbol: '€', description: 'Euros' },
 	SVC: { symbol: '₡', description: 'Colones salvadoreños' },
 	GTQ: { symbol: 'Q', description: 'Quetzales guatemaltecos' },
 	HNL: { symbol: 'L', description: 'Lempiras hondureños' },
 	MXN: { symbol: '$', description: 'Pesos mexicanos' },
 	NIO: { symbol: 'C$', description: 'Córdobas nicaragüenses' },
 	PAB: { symbol: 'B/.', description: 'Balboas panameños' },
 	BOB: { symbol: 'Bs.', description: 'Bolivianos' },
 	PYG: { symbol: '₲', description: 'Guaraníes paraguayos' },
 	PEN: { symbol: 'S/', description: 'Soles peruanos' },
 	DOP: { symbol: '$', description: 'Pesos dominicanos' },
 	UYU: { symbol: '$', description: 'Pesos uruguayos' },
 	VES: { symbol: 'Bs.', description: 'Bolívares venezolanos' },
 	GBP: { symbol: '£', description: 'Libras esterlinas' },
 	CAD: { symbol: '$', description: 'Dólares canadienses' },
 	CHF: { symbol: 'CHF', description: 'Francos suizos' },
 	JPY: { symbol: '¥', description: 'Yenes japoneses' },
 	CNY: { symbol: '¥', description: 'Yuanes chinos' },
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 }).format(amount);
};

export const EnrollmentPaymentCell: React.FC<PaymentCellProps> = ({ payments }) => {
    const totals = useMemo(() => {
        return payments.reduce((acc, payment) => {
            const amount = typeof payment.monto === 'string' ? 
                parseFloat(payment.monto.replace(',', '.')) : 
                payment.monto;
            acc[payment.moneda] = (acc[payment.moneda] || 0) + amount;
            return acc;
        }, {} as Record<string, number>);
    }, [payments]);

    const formattedTotals = useMemo(() => {
        return Object.entries(totals)
            .map(([currency, total]) => 
                `${currency} ${currencyDetails[currency]?.symbol || ''}${formatCurrency(total)}`)
            .join(' + ');
    }, [totals]);

    const tooltipContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
            {payments.map((payment, index) => (
                <Typography
                    key={index}
                    variant='body2'
                    sx={{ whiteSpace: 'nowrap', fontSize: '14px' }}
                >
                    {`Pago ${index + 1}: ${payment.moneda} ${currencyDetails[payment.moneda]?.symbol || ''}${
                        formatCurrency(parseFloat(payment.monto.toString()))
                    }`}
                </Typography>
            ))}
            <Box sx={{ height: '1px', bgcolor: 'divider', my: '.25rem' }} />
            <Typography variant='body2' sx={{ fontWeight: 500, fontSize: '14px' }}>
                Total: {formattedTotals}
            </Typography>
        </Box>
    );

    return (
        <Tooltip title={tooltipContent} arrow placement="bottom">
            <Typography
                sx={{
                    maxWidth: '11rem',
                    overflow: 'hidden',
                    fontSize: '14px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
            >
                {formattedTotals}
            </Typography>
        </Tooltip>
    );
}; 