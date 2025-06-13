export class Functions {

    static mapStatusReembolsoToColor(status) {
        if (!status) return 'default';

        switch (status.toLowerCase()) {
            case 'pendente':
                return 'warning';
            case 'aprovado':
                return 'success';
            case 'reprovado':
            case 'reprovado – aguardando correção':
                return 'error';
            case 'devolvido pelo gerente – aguardando correção':
                return 'warning';
            default:
                return 'default';
        }
    }

    static mapStatusEmpregadoToColor(status) {
        if (status === true) return 'success';
        if (status === false) return 'error';
        return 'default';
    }

    // Função para converter texto para camelCase
    static convertCamelCase = (str: string) => {
        const cleanStr = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z\s]/g, '');
        const words = cleanStr.split(' ').filter(word => word.length > 0);
        const camelCased = words.map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        return camelCased.join('');
    };

    static formatToCurrency(value: string): string {
        // Limita o valor a dois decimais sem arredondar
        const stringValue = value.toString();
        const [integerPart, decimalPart = ''] = stringValue.split('.');

        // Mantém até 2 casas decimais sem arredondar
        const limitedDecimalPart = decimalPart.slice(0, 2).padEnd(2, '0');

        // Adiciona o separador de milhares (.)
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Junta as partes formatadas (inteira e decimal) com vírgula
        return `${formattedIntegerPart},${limitedDecimalPart}`;
    }

}