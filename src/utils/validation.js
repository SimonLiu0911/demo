import * as Yup from 'yup';

export const accountSchema = Yup.object().shape({
  required: Yup.string().required(),
  notRequired: Yup.string().notRequired(),
  memberId: Yup.string().matches(/^[A-Za-z0-9 \-_/－＿]+$/).max(30),
  name: Yup.string().matches(/^[A-Za-z0-9\u4e00-\u9fa5 ()'-\\_!@#$%^&*()\\[\]{}<>?=+-~`';":.,|！＠＃＄％︿＆＊（）［］｛｝＜＞？＝＋－＿\\／～‵’； ”：．，｜]+$/, {
    excludeEmptyString: true
  }).max(30),
  email: Yup.string().email().max(50),
  accInfoList: Yup.array().of(
    Yup.object().shape({
      bank: Yup.string().test(
        'required-with-account',
        '',
        function (value) {
          const { account } = this.parent;
          if (account?.length) {
            return value && value !== '';
          }
          return true;
        }
      ),
      account: Yup.string().test(
        'required-with-bank',
        '',
        function (value) {
          const { bank } = this.parent;
          if (bank?.length) {
            return value && value !== '' && value.length <= 16 && /^\d+$/.test(value);
          }
          return true;
        }
      )
    })
  )
});
