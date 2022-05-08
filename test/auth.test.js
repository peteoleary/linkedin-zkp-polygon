const auth = require('../src/pages/api/auth')
const ZKProof = require('../src/zk_proofs')
jest.mock('../src/zk_proofs');

test('responds to /auth', async () => {
       
    const req = { body: {email: 'pete@timelight.com', captchaCode: '03AGdBq248tnAe3TGYzgTC4Q8WLXMuQeaJW7Z0T6JTfPV69bG6od_s1RQrE7sNI-tjpVplEN_KyjNf-8-5BSVxTj9DOtNWUGi5kDYnhwD0_st8ANkjNBZpUiuin13LDQfk6O2QEq5nofJhYqfooctBopD9wCuZgojzSMxyY0IJ6fZUQeRrvn-NbdGZQ0ErHp__HA3u1QFR6T5GN3e_k7L0xCtJZ8pFFETWZqLi-rKeMx4orZKqY1hH63ojyNJoNCyhjwUS8mQSwNWxXoZqYgmmkQUji2I_W5UB0MOb2MtsAjb055i4RF1ibxM0eKP7iiN9DPkGi_R449A3BZ40piT5p5WmPmp-dJl4GqHTrU6aCU2YBgydG4kv8WPIrbuBKVbnCkSCZzBVFLJ5057kUuSFWmk2gBzxWwULXO72qtJnLNoyYxa24uy_7FTc2c-cAtYsk35hIuTjWbHPLvDH2lqMRnwce522ALl3KmYalFlzSSEjfg4RFEqb-1kD6grmbryPT5Iw4VATIi4YbPGD6TKR6mfCDvnLk8D_-w'}  };

    // TODO: mock this response object
    const res = { json: function(obj) {return obj},
        status: function(code) { return this } 
    };
    return auth(req, res).then(data => {
        expect(data.captchaCodeHash).toEqual('0x6d46b72ff56458eaecce4bd88876de9e');
    })
}, 30000);