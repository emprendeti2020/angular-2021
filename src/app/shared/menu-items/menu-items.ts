import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface BadgeItem {
    type: string;
    value: string;
}
export interface Saperator {
    name: string;
    type?: string;
}
export interface SubChildren {
    state: string;
    name: string;
    type?: string;
}
export interface ChildrenItems {
    state: string;
    name: string;
    type?: string;
    child?: SubChildren[];
}

export interface Menu {
    state: string;
    name: string;
    type: string;
    icon: string;
    badge?: BadgeItem[];
    saperator?: Saperator[];
    children?: ChildrenItems[];
}

const MENUITEMS = [

    {
        state: '',
        name: 'Operacion',
        type: 'saperator',
        icon: 'av_timer'
    },
    {
        state: 'operaciones',
        name: 'Operación',
        type: 'sub',
        icon: 'av_timer',
        children: [
            { state: 'incidente', name: 'Incidentes', type: 'link' },
            { state: 'operacion', name: 'Operaciones', type: 'link' },
            { state: 'contrato', name: 'Contratos', type: 'link' },
        ]
    },

    {
        state: '',
        name: 'Mantenedores',
        type: 'saperator',
        icon: 'av_timer'
    },
    {
        state: 'mantenedores',
        name: 'Mantenedores',
        type: 'sub',
        icon: 'av_timer',
        children: [
            { state: 'inumeble', name: 'Inmuebles', type: 'link' },
            { state: 'arrendatario', name: 'Arrendatarios', type: 'link' },
            { state: 'dueno', name: 'Dueños', type: 'link' },
            { state: 'tecnico', name: 'Tecnicos', type: 'link' }
        ]
    },

    {
        state: '',
        name: 'Configuración',
        type: 'saperator',
        icon: 'av_timer'
    },
    {
        state: 'configuraciones',
        name: 'Configuración & Roles',
        type: 'sub',
        icon: 'av_timer',
        children: [
            { state: 'usuario', name: 'Usuarios', type: 'link' },
            { state: 'rol', name: 'Roles', type: 'link' },
            { state: 'parametro', name: 'Parametros', type: 'link' },
            { state: 'empresa', name: 'Empresa', type: 'link' }
        ]
    }
    /*     {
            state: '',
            name: 'Personal',
            type: 'saperator',
            icon: 'av_timer'
        },
        {
            state: 'dashboards',
            name: 'Dashboards',
            type: 'sub',
            icon: 'av_timer',
            children: [
                { state: 'dashboard1', name: 'Dashboard 1', type: 'link' },
                { state: 'dashboard2', name: 'Dashboard 2', type: 'link' }
            ]
        },
        {
            state: 'apps',
            name: 'Apps',
            type: 'sub',
            icon: 'apps',
            badge: [{ type: 'warning', value: 'new' }],
            children: [
                { state: 'calendar', name: 'Calendar', type: 'link' },
                { state: 'mailbox', name: 'Mailbox', type: 'link' },
                { state: 'messages', name: 'Mail', type: 'link' },
                { state: 'chat', name: 'Chat', type: 'link' },
                { state: 'taskboard', name: 'Taskboard', type: 'link' },
                { state: 'notes', name: 'Notes', type: 'link' },
    
                { state: 'employeelist', name: 'Employees', type: 'link' },
    
                { state: 'courses', name: 'Courses', type: 'link' },
                { state: 'contact', name: 'Contact', type: 'link' },
    
                { state: 'ticketlist', name: 'Ticket List', type: 'link' },
    
                { state: 'ticketdetails', name: 'Ticket Details', type: 'link' },
    
                { state: 'invoice', name: 'Invoice', type: 'link' },
                { state: 'todo', name: 'Todo', type: 'link' },
            ]
        },
        {
            state: 'material',
            name: 'Material Ui',
            type: 'sub',
            icon: 'bubble_chart',
            badge: [{ type: 'red', value: '17' }],
            children: [
                { state: 'badge', name: 'Badge', type: 'link' },
                { state: 'button', name: 'Buttons', type: 'link' },
                { state: 'cards', name: 'Cards', type: 'link' },
                { state: 'grid', name: 'Grid List', type: 'link' },
                { state: 'lists', name: 'Lists', type: 'link' },
                { state: 'menu', name: 'Menu', type: 'link' },
                { state: 'tabs', name: 'Tabs', type: 'link' },
                { state: 'stepper', name: 'Stepper', type: 'link' },
                { state: 'ripples', name: 'Ripples', type: 'link' },
                { state: 'expansion', name: 'Expansion Panel', type: 'link' },
                { state: 'chips', name: 'Chips', type: 'link' },
                { state: 'toolbar', name: 'Toolbar', type: 'link' },
                { state: 'progress-snipper', name: 'Progress snipper', type: 'link' },
                { state: 'progress', name: 'Progress Bar', type: 'link' },
                { state: 'dialog', name: 'Dialog', type: 'link' },
                { state: 'tooltip', name: 'Tooltip', type: 'link' },
                { state: 'snackbar', name: 'Snackbar', type: 'link' },
                { state: 'slider', name: 'Slider', type: 'link' },
                { state: 'slide-toggle', name: 'Slide Toggle', type: 'link' }
            ]
        },
    
        {
            state: 'tree',
            name: 'Tree',
            type: 'sub',
            icon: 'brightness_7',
            children: [
                { state: 'dynamic-tree', name: 'Dynamic data tree', type: 'link' },
                { state: 'flat-tree', name: 'Flat Tree', type: 'link' },
                { state: 'load-tree', name: 'Loaded Data tree', type: 'link' },
                { state: 'nested-tree', name: 'Nested tree', type: 'link' }
            ]
        },
        {
            state: '',
            name: 'Forms, Table & Widgets',
            type: 'saperator',
            icon: 'av_timer'
        },
        {
            state: 'forms',
            name: 'Forms',
            type: 'sub',
            icon: 'insert_drive_file',
            children: [
                { state: 'form-layout', name: 'Form-Layout', type: 'link' },
                { state: 'autocomplete', name: 'Autocomplete', type: 'link' },
                { state: 'checkbox', name: 'Checkbox', type: 'link' },
                { state: 'radiobutton', name: 'Radio Button', type: 'link' },
                { state: 'datepicker', name: 'Datepicker', type: 'link' },
                { state: 'select', name: 'Select', type: 'link' },
                { state: 'formfield', name: 'Form Field', type: 'link' },
                { state: 'input', name: 'Inputs', type: 'link' },
                { state: 'editor', name: 'Editor', type: 'link' },
                { state: 'form-validation', name: 'Form Validation', type: 'link' },
                { state: 'wizard', name: 'Wizard', type: 'link' },
                { state: 'paginator', name: 'Paginator', type: 'link' },
                { state: 'sortheader', name: 'Sort Header', type: 'link' },
            ]
        },
        {
            state: 'tables',
            name: 'Tables',
            type: 'sub',
            icon: 'web',
            children: [
                { state: 'basictable', name: 'Basic Table', type: 'link' },
                { state: 'filterable', name: 'Filterable Table', type: 'link' },
                { state: 'pagination', name: 'Pagination Table', type: 'link' },
                { state: 'sortable', name: 'Sortable Table', type: 'link' },
                { state: 'mix', name: 'Mix Table', type: 'link' },
                { state: 'dynamic-table', name: 'Dynamic Table', type: 'link' },
                { state: 'expand-table', name: 'Expand Table', type: 'link' },
                { state: 'footerrow-table', name: 'Footer row Table', type: 'link' },
                { state: 'multiple-header-footer', name: 'Multiple Header Footer', type: 'link' },
                { state: 'http-table', name: 'HTTP Table', type: 'link' },
                { state: 'row-context-table', name: 'Row Context Table', type: 'link' },
                { state: 'selection-table', name: 'Selection Table', type: 'link' },
                { state: 'sticky-column-table', name: 'Sticky Column Table', type: 'link' },
                { state: 'sticky-footer-table', name: 'Sticky Footer Table', type: 'link' },
            ]
        },
        {
            state: 'datatables',
            name: 'Data Tables',
            type: 'sub',
            icon: 'border_all',
            children: [
                { state: 'basicdatatable', name: 'Basic Data Table', type: 'link' },
                { state: 'filter', name: 'Filterable', type: 'link' },
                { state: 'editing', name: 'Editing', type: 'link' },
                { state: 'materialtable', name: 'Material Table', type: 'link' }
            ]
        },
        {
            state: 'widgets',
            name: 'Widgets',
            type: 'link',
            icon: 'widgets'
        },
        {
            state: '',
            name: 'Extra Component',
            type: 'saperator',
            icon: 'av_timer'
        },
        {
            state: 'authentication',
            name: 'Authentication',
            type: 'sub',
            icon: 'perm_contact_calendar',
            children: [
                { state: 'login', name: 'Login', type: 'link' },
                { state: 'register', name: 'Register', type: 'link' },
                { state: 'forgot', name: 'Forgot', type: 'link' },
                { state: 'lockscreen', name: 'Lockscreen', type: 'link' },
                { state: '404', name: 'Error', type: 'link' }
            ]
        },
        {
            state: 'charts',
            name: 'Charts',
            type: 'sub',
            icon: 'insert_chart',
            children: [
                { state: 'chartjs', name: 'Chart Js', type: 'link' },
                { state: 'chartistjs', name: 'Chartist Js', type: 'link' },
                { state: 'ngxchart', name: 'Ngx Charts', type: 'link' }
            ]
        },
        {
            state: 'pages',
            name: 'Pages',
            type: 'sub',
            icon: 'content_copy',
            children: [
                { state: 'timeline', name: 'Timeline', type: 'link' },
                { state: 'invoice', name: 'Invoice', type: 'link' },
                { state: 'pricing', name: 'Pricing', type: 'link' },
                { state: 'helper', name: 'Helper Classes', type: 'link' },
                {
                    state: 'icons',
                    name: 'Icons',
                    type: 'subchild',
                    subchildren: [
                        {
                            state: 'material',
                            name: 'Material Icons',
                            type: 'link'
                        }
                    ]
                }
            ]
        },
        {
            state: 'multi',
            name: 'Menu Levels',
            icon: 'star',
            type: 'sub',
            children: [
                {
                    state: 'second-level',
                    name: 'Second Level',
                    type: 'link'
                },
                {
                    state: 'third-level',
                    name: 'Second Level',
                    type: 'subchild',
                    subchildren: [
                        {
                            state: 'third-level',
                            name: 'Third Level',
                            type: 'link'
                        }
                    ]
                },
                {
                    state: 'third-level',
                    name: 'aSecond Level',
                    type: 'subchild',
                    subchildren: [
                        {
                            state: 'athird-level',
                            name: 'Third Level',
                            type: 'link'
                        }
                    ]
                }
            ]
        } */
];

@Injectable()
export class MenuItems {

    menu$ = new BehaviorSubject<Menu[]>(MENUITEMS)

    getMenuitem(): Observable<Menu[]> {
        return this.menu$.asObservable();
        //return of(MENUITEMS);
    }
}
