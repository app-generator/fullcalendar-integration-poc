import useInterceptors from './interceptor';

const useApi = () => {
    const interceptor = useInterceptors();
   
    const api = {
        // login
        // adminLogin: (data, params = {}) => interceptor.post(`/user/dashboard/api/login/`, data, { params: params, NxtbnPublicAPI: true }),
        // product
        getShift: (params = {}) => interceptor.get(`/shift_poc/shifts/`, { params: params }),
        updateShift: (id, data, params = {}) => interceptor.put(`/shift_poc/shifts/${id}`, data, { params: params }),

        getTimeSlot: (params = {}) => interceptor.get(`/shift_poc/timeslots/`, { params: params }),
        updateTimeSlot: (data, params = {}) => interceptor.put(`/shift_poc/update_slots/`, data, { params: params }),
        createTimeSlot: (data, params = {}) => interceptor.post(`/shift_poc/timeslots/`, data, { params: params }),
        getSlotListFilter: (params = {}) => interceptor.get(`/shift_poc/slot-list/`, { params: params }),
        deleteSlot: (id, params = {}) => interceptor.delete(`/shift_poc/timeslots/${id}`, { params: params }),
        bookTimeSlot: (id, data, params = {}) => interceptor.put(`/shift_poc/timeslots/${id}/book/`, data, { params: params }),

        getUser: (params = {}) => interceptor.get(`/shift_poc/users/`, { params: params }),
    };
    
    return api;
}

export default useApi;