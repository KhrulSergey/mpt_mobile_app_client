import each from 'lodash-es/each';
import format from 'date-fns/format';
import { DATE } from '../constants/DateTime';
import {
    PROJECT_FETCHING,
    PROJECT_FETCHING_SUCCESS,
    PROJECT_FETCHING_FAIL
} from '../constants/ActionTypes';
import { store } from '../configureStore';

const INITIAL_STATE = {
    data: {},
    fetching: false,
    fetchingError: null
};

function setProps(data, additional_data, ...props) {
    each(props, prop => {
        if (additional_data[prop]) data[prop] = additional_data[prop];
        // data[prop] = additional_data[prop] || 'Информация отсутствует.';
    });
}

function setDates(data, additional_data, ...props) {
    each(props, prop => {
        if (additional_data[prop]) data[prop] = format(additional_data[prop], DATE);
        // data[prop] = format(additional_data[prop], DATE) || 'Информация отсутствует.';
    });
}

function setArrays(data, additional_data, ...props) {
    //data.coexecutors = payload.data.coexecutors && payload.data.coexecutors.length > 0 ? payload.data.coexecutors.join(', ') : 'информация отсутствует';
    each(props, prop => {
        const a = additional_data[prop];
        if (a) data[prop] = a.length > 0 ? (a instanceof Array ? a.join(', ') : a) : 'информация отсутствует';
    });
}

const getData = (state, payload) => {
    const data = {};
    const { id, name, status_code, status_name, additional_data, project_group_id, date_from, date_to, budget_plan, code, description, industries, region_name, company_name, technological_directions } = payload.data;
    data.project_group = project_group_id ? store.getState().refs.data.projectGroupsDict[project_group_id] : { code: '0', name: 'Не задано' };
    if (additional_data) {
        switch (data.project_group.code) {
            case 'import':
                setProps(data, additional_data, 'steps');
                setArrays(data, additional_data, 'executor', 'coexecutors');
                break;
            case 'initiative':
                setProps(data, additional_data, 'goals', 'tasks', 'municipality', 'cipher');
                setDates(data, additional_data, 'date_from_fact', 'date_to_fact');
                setArrays(data, additional_data, 'executor');
                break;
            case 'diversification':
                setProps(data, additional_data, 'goals');
                setArrays(data, additional_data, 'executor', 'product');
                break;
            case 'spic':
                setProps(data, additional_data, 'department', 'requisites', 'type', 'municipality');
                setArrays(data, additional_data, 'related_persons', 'product');
                break;
            case 'pp1312':
                setProps(data, additional_data, 'budget_fact', 'territory', 'indicators', 'product_unit', 'department', 'requisites', 'type', 'queue_select');
                setDates(data, additional_data, 'date_from_fact', 'date_to_fact');
                setArrays(data, additional_data, 'executor', 'product');
                break;
            case 'pp3':
                setProps(data, additional_data, 'territory', 'goals', 'tasks', 'indicators', 'subsidy_plan', 'subsidy_fact');
                setArrays(data, additional_data, 'executor', 'product');
                break;
            default:
                // check for common properties
        }
    }
    data.id = id;
    data.date_from = format(date_from, DATE);
    data.date_to = format(date_to, DATE);
    data.budget_plan = budget_plan ? `${budget_plan} руб.` : 'Нет информации.';
    data.code = code || 'не задан';
    data.description = description || 'Описание проекта отсутствует.';
    data.industries = industries.map(industry => industry.name).join(', ');
    if (region_name) data.region_name = region_name;
    data.company_name = company_name || 'Не задано.';
    data.name = name;
    data.status_code = status_code;
    data.status_name = status_name;
    data.technological_directions = technological_directions.map(td => td.name).join(', ');
    data.additionalProperties = [
        { prop: 'territory', label: 'Территория реализации проекта (место реализации)' },
        { prop: 'type', label: 'Тип проекта' },
        { prop: 'goals', label: 'Цели проекта' },
        { prop: 'tasks', label: 'Задачи проекта' },
        { prop: 'subsidy_plan', label: 'Запрашиваемый (плановый) размер субсидии' },
        { prop: 'subsidy_fact', label: 'Фактический размер субсидии' },
        { prop: 'product', label: 'Наименование продукции' },
        { prop: 'product_unit', label: 'Единицы измерения продукта' },
        { prop: 'cipher', label: 'Шифр продукции' },
        { prop: 'department', label: 'Ответственный департамент Минпромторга России' },
        { prop: 'requisites', label: 'Реквизиты договора (проекта, номер и дата)' },
        { prop: 'queue_select', label: 'Очередь отбора' },
        { prop: 'municipality', label: 'Муниципальное образование' },
        { prop: 'related_persons', label: 'Привлеченные лица' },
        { prop: 'executor', label: 'Ответственный исполнитель (контактное лицо)' }
    ];
    return { ...state, fetching: false, fetchingError: null, data };
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case PROJECT_FETCHING:
            return { ...state, fetching: true, data: {} };
        case PROJECT_FETCHING_SUCCESS:
            return getData(state, payload);
        case PROJECT_FETCHING_FAIL:
            return { ...state, fetching: false, fetchingError: payload };
        default:
            return state;
    }
};
