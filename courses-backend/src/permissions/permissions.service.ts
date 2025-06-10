import { Injectable, ForbiddenException } from '@nestjs/common';
import { permissions } from './permissions';
import { Role } from 'src/common/enums/enums';

@Injectable()
export class PermissionsService {
  getViewableFields(role: Role, model: string): any {
    const fields = permissions[model]?.view?.[role];

    if (fields === 'ALL') {
      return undefined;
    }

    if (!fields) {
      throw new ForbiddenException(
        `No tienes permisos para ver los campos del modelo ${model}.`,
      );
    }

    return fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
  }

  validateEditableFields(role: Role, model: string, data: any) {
    const allowedFields = permissions[model]?.edit?.[role];

    if (allowedFields === 'ALL') {
      return data;
    }

    if (!allowedFields) {
      throw new ForbiddenException(
        `No tienes permisos para editar campos del modelo ${model}.`,
      );
    }

    const validValues = permissions[model]?.validValues?.[role] || {};

    const filteredData = Object.keys(data).reduce((acc, key) => {
      if (allowedFields.includes(key)) {
        if (validValues[key] && !validValues[key].includes(data[key])) {
          throw new ForbiddenException(
            `El valor "${data[key]}" no está permitido para el campo "${key}".`,
          );
        }
        acc[key] = data[key];
      }
      return acc;
    }, {});

    if (Object.keys(filteredData).length === 0) {
      throw new ForbiddenException(
        'No tienes permisos para modificar estos campos.',
      );
    }

    return filteredData;
  }
}
