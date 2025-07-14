// Tipos actualizados para coincidir con la nueva base de datos
export interface Models {
    Persona: {
      idpersona: number;
      identificacion: string;
      nombre: string;
      apellido: string;
      telefono?: string;
      correo: string;
      contrasena: string;
      edad: number;
      ficha?: number;
      rol?: number;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      rolRelation?: Partial<Models["Rol"]>;
      fichaRelation?: Partial<Models["Ficha"]>;
      encargos?: Partial<Models["Detalles"]>[];
      solicitudes?: Partial<Models["Detalles"]>[];
      aprobaciones?: Partial<Models["Detalles"]>[];
      movimiento?: Partial<Models["Movimiento"]>[];
    };
  
    Ficha: {
      idficha: number;
      numficha: number;
      cantidadaprendices?: number;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      persona?: Partial<Models["Persona"]>[];
      titulado?: Partial<Models["Titulado"]>[];
    };
  
    Rol: {
      idrol: number;
      nombrerol: string;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      permisosidpermiso?: number;
      persona?: Partial<Models["Persona"]>[];
      permisos?: Partial<Models["Permiso"]>;
    };
  
    Detalles: {
      iddetalle: number;
      material?: number;
      cantidasolicitada: number;
      descripcion?: string;
      personaencargada?: number;
      personasolicita?: number;
      personaaprueba?: number;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      materialRelation?: Partial<Models["Material"]>;
      personaencargadaRelation?: Partial<Models["Persona"]>;
      personasolicitaRelation?: Partial<Models["Persona"]>;
      personaapruebaRelation?: Partial<Models["Persona"]>;
    };
   
    Material: {
      idmaterial: number;
      tipomaterial?: number;
      nombrematerial: string;
      descripcion: string;
      stock: number;
      unidadmedida?: number;
      categoriamaterial?: number;
      caduca: boolean;
      activo: boolean;
      fechavencimiento?: Date;
      fechacreacion: Date;
      fechaactualización?: Date;
      detalle?: Partial<Models["Detalles"]>[];
      tipomaterialRelation?: Partial<Models["TipoMaterial"]>;
      unidadmedidaRelation?: Partial<Models["UnidadMedida"]>;
      categoriamaterialRelation?: Partial<Models["CategoriaMaterial"]>;
    };
  
    TipoMaterial: {
      idtipomaterial: number;
      tipo: string;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      material?: Partial<Models["Material"]>[];
    };
  
    UnidadMedida: {
      idunidadmedida: number;
      unidadmedida: string;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      material?: Partial<Models["Material"]>[];
    };
  
    CategoriaMaterial: {
      idcategoriamaterial: number;
      códigomaterial: string;
      categoria: string;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      material?: Partial<Models["Material"]>[];
    };
  
    Sede: {
      idsede: number;
      sede: string;
      centro?: number;
      direccion: string;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      centroRelation?: Partial<Models["Centro"]>;
    };
  
    Centro: {
      idcentro: number;
      centro: string;
      municipio?: number;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      municipioRelation?: Partial<Models["Municipio"]>;
      areacentro?: Partial<Models["AreaCentro"]>[];
      sede?: Partial<Models["Sede"]>[];
    };
  
    Municipio: {
      idmunicipio: number;
      municipio: string;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      centro?: Partial<Models["Centro"]>[];
    };
  
    AreaCentro: {
      idareacentro: number;
      centro?: number;
      area?: number;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      centroRelation?: Partial<Models["Centro"]>;
      areaRelation?: Partial<Models["Area"]>;
    };
  
    Area: {
      idarea: number;
      area: string;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      areacentro?: Partial<Models["AreaCentro"]>[];
      titulado?: Partial<Models["Titulado"]>[];
    };
  
    Titulado: {
      idtitulado: number;
      titulado: string;
      area?: number;
      ficha?: number;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      areaRelation?: Partial<Models["Area"]>;
      fichaRelation?: Partial<Models["Ficha"]>;
    };
  
    Sitio: {
      idsitio: number;
      sitio: string;
      tipositio?: number;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      tipositionRelation?: Partial<Models["TipoSitio"]>;
    };
  
    TipoSitio: {
      idtipositio: number;
      tipositio: string;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      sitio?: Partial<Models["Sitio"]>[];
    };
  
    Movimiento: {
      idmovimiento: number;
      tipomovimiento?: number;
      movimientopersona?: number;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      tipomovimientoRelation?: Partial<Models["TipoMovimiento"]>;
      movimientopersonaRelation?: Partial<Models["Persona"]>;
    };
  
    TipoMovimiento: {
      idtipomovimiento: number;
      tipomovimiento: string;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      movimiento?: Partial<Models["Movimiento"]>[];
    };

    // Nuevas entidades del sistema de permisos
    Modulos: {
      id: number;
      nombre_modulo: string;
      opciones?: Partial<Models["Opciones"]>[];
    };

    Opciones: {
      id: number;
      nombre_opcion: string;
      descripcion?: string;
      ruta_frontend: string;
      id_modulo: number;
      modulo?: Partial<Models["Modulos"]>;
      permisos?: Partial<Models["Permiso"]>[];
    };

    Permiso: {
      idpermiso: number;
      nombre: string;
      descripcion?: string;
      codigo: string;
      activo: boolean;
      fechacreacion: Date;
      fechaactualización?: Date;
      id_opcion?: number;
      opcion?: Partial<Models["Opciones"]>;
      roles?: Partial<Models["RolPermisoOpcion"]>[];
    };

    RolPermisoOpcion: {
      id: number;
      id_rol?: number;
      id_permiso?: number;
      id_opcion?: number;
      rol?: Partial<Models["Rol"]>;
      permiso?: Partial<Models["Permiso"]>;
      opcion?: Partial<Models["Opciones"]>;
    };
  }

// Tipos de conveniencia para uso en componentes (manteniendo compatibilidad)
export type Persona = Models["Persona"];
export type Ficha = Models["Ficha"];
export type Rol = Models["Rol"];
export type Detalles = Models["Detalles"];
export type Material = Models["Material"];
export type TipoMaterial = Models["TipoMaterial"];
export type UnidadMedida = Models["UnidadMedida"];
export type CategoriaMaterial = Models["CategoriaMaterial"];
export type Sede = Models["Sede"];
export type Centro = Models["Centro"];
export type Municipio = Models["Municipio"];
export type AreaCentro = Models["AreaCentro"];
export type Area = Models["Area"];
export type Titulado = Models["Titulado"];
export type Sitio = Models["Sitio"];
export type TipoSitio = Models["TipoSitio"];
export type Movimiento = Models["Movimiento"];
export type TipoMovimiento = Models["TipoMovimiento"];
export type Modulos = Models["Modulos"];
export type Opciones = Models["Opciones"];
export type Permiso = Models["Permiso"];
export type RolPermisoOpcion = Models["RolPermisoOpcion"];
  