// Базовый путь модуля водителей (задается при подключении роутера на setup-app).
export const DRIVERS_PATH = '/api/drivers';

// Относительные под-маршуты внутри роутера водителей - чтобы не хардкорить строки.
export const DRIVERS_ROUTES = {
    ROOT: '',
    BY_ID: '/:id',
} as const;
