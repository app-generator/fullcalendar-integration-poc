import useInterceptors from './interceptor';

const useApi = () => {
    const interceptor = useInterceptors();
   
    const api = {
        getTimeSlot: (params = {}) => interceptor.get(`/shift_poc/timeslots/`, { params: params }),
        getTimeSlotDetail: (id, params = {}) => interceptor.get(`/shift_poc/timeslots/${id}/`, { params: params }),
        updateTImeSlot: (id, data, params = {}) => interceptor.put(`/shift_poc/timeslots/${id}/`, data, { params: params }),
        bulkUpdateTimeSlot: (data, params = {}) => interceptor.put(`/shift_poc/update_slots/`, data, { params: params }),
        createTimeSlot: (data, params = {}) => interceptor.post(`/shift_poc/timeslots/`, data, { params: params }),
        getSlotListFilter: (params = {}) => interceptor.get(`/shift_poc/slot-list/`, { params: params }),
        deleteSlot: (id, params = {}) => interceptor.delete(`/shift_poc/timeslots/${id}`, { params: params }),
        bookTimeSlot: (id, data, params = {}) => interceptor.put(`/shift_poc/timeslots/${id}/book/`, data, { params: params }),

        updateShift: (id, data, params = {}) => interceptor.put(`shift_poc/shift/${id}/edit/`, data, { params: params }),

        getUser: (params = {}) => interceptor.get(`/shift_poc/users/`, { params: params }),
    };
    
    return api;
}

export default useApi;