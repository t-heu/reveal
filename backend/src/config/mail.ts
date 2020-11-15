interface IMailConfig {
  driver: 'ethereal' | 'gmail'; // | 'ses'
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      email: 'staff@reveal.com',
      name: 'Staff Reveal',
    },
  },
} as IMailConfig;
