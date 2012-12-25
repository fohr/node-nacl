
var test = require("tap").test;
var crypto = require("crypto");

var n = require("../index").nacl;

test("box", function(t) {

    // test case from naclcrypto-20090310.pdf, page 35

    var key = Buffer("1b27556473e985d462cd51197a9a46c7"+
                     "6009549eac6474f206c4ee0844f68389", "hex");
    var nonce = Buffer("69696ee955b62b73cd62bda875fc73d68219e0036b7a0b37", "hex");
    var msg = Buffer("be075fc53c81f2d5cf141316ebeb0c7b"+
                     "5228c52a4c62cbd44b66849b64244ffc"+
                     "e5ecbaaf33bd751a1ac728d45e6c6129"+
                     "6cdc3c01233561f41db66cce314adb31"+
                     "0e3be8250c46f06dceea3a7fa1348057"+
                     "e2f6556ad6b1318a024a838f21af1fde"+
                     "048977eb48f59ffd4924ca1c60902e52"+
                     "f0a089bc76897040e082f93776384864"+
                     "5e0705", "hex"); // 131 bytes long
    var boxed = Buffer("f3ffc7703f9400e52a7dfb4b3d3305d9"+
                       "8e993b9f48681273c29650ba32fc76ce"+
                       "48332ea7164d96a4476fb8c531a1186a"+
                       "c0dfc17c98dce87b4da7f011ec48c972"+
                       "71d2c20f9b928fe2270d6fb863d51738"+
                       "b48eeee314a7cc8ab932164548e526ae"+
                       "90224368517acfeabd6bb3732bc0e9da"+
                       "99832b61ca01b6de56244a9e88d5f9b3"+
                       "7973f622a43d14a6599b1f654cb45a74"+
                       "e355a5", "hex"); // 147-byte boxed packet

    var alice_sk = Buffer("77076d0a7318a57d3c16c17251b26645"+
                          "df4c2f87ebc0992ab177fba51db92c2a", "hex");
    var alice_pk = Buffer("8520f0098930a754748b7ddcb43ef75a"+
                          "0dbf3a0d26381af4eba4a98eaa9b4e6a", "hex");

    var bob_sk = Buffer("5dab087e624a8a4b79e17f8b83800ee6"+
                        "6f3bb1292618b6fd1c2f8b27ff88e0eb", "hex");
    var bob_pk = Buffer("de9edb7d7b7dc1b4d35b61c2ece43537"+
                        "3f8343c85b78674dadfc7e146f882b4f", "hex");

    // alice sends to bob
    t.equivalent(n.box(msg, nonce, bob_pk, alice_sk), boxed);
    t.equivalent(n.box_open(boxed, nonce, alice_pk, bob_sk), msg);

    // bob sends to alice
    t.equivalent(n.box(msg, nonce, alice_pk, bob_sk), boxed);
    t.equivalent(n.box_open(boxed, nonce, bob_pk, alice_sk), msg);

    // bad arguments
    t.throws(function() {n.box(msg, nonce, alice_pk, bob_sk, "extra");},
             {name: "Error", message: "Args: message, nonce, pubkey, privkey"});
    t.throws(function() {n.box(0, nonce, alice_pk, bob_sk);},
             {name: "TypeError", message: "arg[0] 'message' must be a Buffer"});
    t.throws(function() {n.box(msg, 0, alice_pk, bob_sk);},
             {name: "TypeError", message: "arg[1] 'nonce' must be a Buffer"});
    t.throws(function() {n.box(msg, nonce, 0, bob_sk);},
             {name: "TypeError", message: "arg[2] 'pubkey' must be a Buffer"});
    t.throws(function() {n.box(msg, nonce, alice_pk, 0);},
             {name: "TypeError", message: "arg[3] 'privkey' must be a Buffer"});
    t.throws(function() {n.box_open(boxed, nonce, alice_pk, bob_sk, "extra");},
             {name: "Error", message: "Args: ciphertext, nonce, pubkey, privkey"});
    t.throws(function() {n.box_open(0, nonce, alice_pk, bob_sk);},
             {name: "TypeError", message: "arg[0] 'ciphertext' must be a Buffer"});
    t.throws(function() {n.box_open(boxed, 0, alice_pk, bob_sk);},
             {name: "TypeError", message: "arg[1] 'nonce' must be a Buffer"});
    t.throws(function() {n.box_open(boxed, nonce, 0, bob_sk);},
             {name: "TypeError", message: "arg[2] 'pubkey' must be a Buffer"});
    t.throws(function() {n.box_open(boxed, nonce, alice_pk, 0);},
             {name: "TypeError", message: "arg[3] 'privkey' must be a Buffer"});

    // and keypair creation
    var alice = n.box_keypair(); // [0] is public key, [1] is private key
    var bob = n.box_keypair();
    var newboxed = n.box(msg, nonce, alice[0], bob[1]);
    t.equivalent(n.box_open(newboxed, nonce, bob[0], alice[1]), msg);

    // now the beforenm/afternm functions
    return t.end(); // not yet implemented

    var pre1 = n.box_beforenm(bob_pk, alice_sk);
    t.equivalent(n.box_afternm(msg, nonce, pre1), boxed);
    var pre2 = n.box_beforenm(alice_pk, bob_sk);
    t.equivalent(n.box_open_afternm(boxed, nonce, pre2), msg);

    t.end();
});

test("box-nacl", function(t) {
    // test cases from the nacl-20110221 tests/box*.* files
    var box1_alicesk = Buffer([0x77,0x07,0x6d,0x0a,0x73,0x18,0xa5,0x7d
                               ,0x3c,0x16,0xc1,0x72,0x51,0xb2,0x66,0x45
                               ,0xdf,0x4c,0x2f,0x87,0xeb,0xc0,0x99,0x2a
                               ,0xb1,0x77,0xfb,0xa5,0x1d,0xb9,0x2c,0x2a]);
    var box1_bobpk = Buffer([0xde,0x9e,0xdb,0x7d,0x7b,0x7d,0xc1,0xb4
                             ,0xd3,0x5b,0x61,0xc2,0xec,0xe4,0x35,0x37
                             ,0x3f,0x83,0x43,0xc8,0x5b,0x78,0x67,0x4d
                             ,0xad,0xfc,0x7e,0x14,0x6f,0x88,0x2b,0x4f]);
    var box1_nonce = Buffer([0x69,0x69,0x6e,0xe9,0x55,0xb6,0x2b,0x73
                             ,0xcd,0x62,0xbd,0xa8,0x75,0xfc,0x73,0xd6
                             ,0x82,0x19,0xe0,0x03,0x6b,0x7a,0x0b,0x37]);
    var box1_msg = Buffer([0xbe,0x07,0x5f,0xc5,0x3c,0x81,0xf2,0xd5
                           ,0xcf,0x14,0x13,0x16,0xeb,0xeb,0x0c,0x7b
                           ,0x52,0x28,0xc5,0x2a,0x4c,0x62,0xcb,0xd4
                           ,0x4b,0x66,0x84,0x9b,0x64,0x24,0x4f,0xfc
                           ,0xe5,0xec,0xba,0xaf,0x33,0xbd,0x75,0x1a
                           ,0x1a,0xc7,0x28,0xd4,0x5e,0x6c,0x61,0x29
                           ,0x6c,0xdc,0x3c,0x01,0x23,0x35,0x61,0xf4
                           ,0x1d,0xb6,0x6c,0xce,0x31,0x4a,0xdb,0x31
                           ,0x0e,0x3b,0xe8,0x25,0x0c,0x46,0xf0,0x6d
                           ,0xce,0xea,0x3a,0x7f,0xa1,0x34,0x80,0x57
                           ,0xe2,0xf6,0x55,0x6a,0xd6,0xb1,0x31,0x8a
                           ,0x02,0x4a,0x83,0x8f,0x21,0xaf,0x1f,0xde
                           ,0x04,0x89,0x77,0xeb,0x48,0xf5,0x9f,0xfd
                           ,0x49,0x24,0xca,0x1c,0x60,0x90,0x2e,0x52
                           ,0xf0,0xa0,0x89,0xbc,0x76,0x89,0x70,0x40
                           ,0xe0,0x82,0xf9,0x37,0x76,0x38,0x48,0x64
                           ,0x5e,0x07,0x05]);
    t.equivalent(n.box(box1_msg, box1_nonce, box1_bobpk, box1_alicesk),
                 Buffer([0xf3,0xff,0xc7,0x70,0x3f,0x94,0x00,0xe5
                         ,0x2a,0x7d,0xfb,0x4b,0x3d,0x33,0x05,0xd9
                         ,0x8e,0x99,0x3b,0x9f,0x48,0x68,0x12,0x73
                         ,0xc2,0x96,0x50,0xba,0x32,0xfc,0x76,0xce
                         ,0x48,0x33,0x2e,0xa7,0x16,0x4d,0x96,0xa4
                         ,0x47,0x6f,0xb8,0xc5,0x31,0xa1,0x18,0x6a
                         ,0xc0,0xdf,0xc1,0x7c,0x98,0xdc,0xe8,0x7b
                         ,0x4d,0xa7,0xf0,0x11,0xec,0x48,0xc9,0x72
                         ,0x71,0xd2,0xc2,0x0f,0x9b,0x92,0x8f,0xe2
                         ,0x27,0x0d,0x6f,0xb8,0x63,0xd5,0x17,0x38
                         ,0xb4,0x8e,0xee,0xe3,0x14,0xa7,0xcc,0x8a
                         ,0xb9,0x32,0x16,0x45,0x48,0xe5,0x26,0xae
                         ,0x90,0x22,0x43,0x68,0x51,0x7a,0xcf,0xea
                         ,0xbd,0x6b,0xb3,0x73,0x2b,0xc0,0xe9,0xda
                         ,0x99,0x83,0x2b,0x61,0xca,0x01,0xb6,0xde
                         ,0x56,0x24,0x4a,0x9e,0x88,0xd5,0xf9,0xb3
                         ,0x79,0x73,0xf6,0x22,0xa4,0x3d,0x14,0xa6
                         ,0x59,0x9b,0x1f,0x65,0x4c,0xb4,0x5a,0x74
                         ,0xe3,0x55,0xa5]));

    var box2_bobsk = Buffer([0x5d,0xab,0x08,0x7e,0x62,0x4a,0x8a,0x4b
                             ,0x79,0xe1,0x7f,0x8b,0x83,0x80,0x0e,0xe6
                             ,0x6f,0x3b,0xb1,0x29,0x26,0x18,0xb6,0xfd
                             ,0x1c,0x2f,0x8b,0x27,0xff,0x88,0xe0,0xeb]);
    var box2_alicepk = Buffer([0x85,0x20,0xf0,0x09,0x89,0x30,0xa7,0x54
                               ,0x74,0x8b,0x7d,0xdc,0xb4,0x3e,0xf7,0x5a
                               ,0x0d,0xbf,0x3a,0x0d,0x26,0x38,0x1a,0xf4
                               ,0xeb,0xa4,0xa9,0x8e,0xaa,0x9b,0x4e,0x6a]);
    var box2_nonce = Buffer([0x69,0x69,0x6e,0xe9,0x55,0xb6,0x2b,0x73
                             ,0xcd,0x62,0xbd,0xa8,0x75,0xfc,0x73,0xd6
                             ,0x82,0x19,0xe0,0x03,0x6b,0x7a,0x0b,0x37]);
    var box2_c = Buffer([0xf3,0xff,0xc7,0x70,0x3f,0x94,0x00,0xe5
                         ,0x2a,0x7d,0xfb,0x4b,0x3d,0x33,0x05,0xd9
                         ,0x8e,0x99,0x3b,0x9f,0x48,0x68,0x12,0x73
                         ,0xc2,0x96,0x50,0xba,0x32,0xfc,0x76,0xce
                         ,0x48,0x33,0x2e,0xa7,0x16,0x4d,0x96,0xa4
                         ,0x47,0x6f,0xb8,0xc5,0x31,0xa1,0x18,0x6a
                         ,0xc0,0xdf,0xc1,0x7c,0x98,0xdc,0xe8,0x7b
                         ,0x4d,0xa7,0xf0,0x11,0xec,0x48,0xc9,0x72
                         ,0x71,0xd2,0xc2,0x0f,0x9b,0x92,0x8f,0xe2
                         ,0x27,0x0d,0x6f,0xb8,0x63,0xd5,0x17,0x38
                         ,0xb4,0x8e,0xee,0xe3,0x14,0xa7,0xcc,0x8a
                         ,0xb9,0x32,0x16,0x45,0x48,0xe5,0x26,0xae
                         ,0x90,0x22,0x43,0x68,0x51,0x7a,0xcf,0xea
                         ,0xbd,0x6b,0xb3,0x73,0x2b,0xc0,0xe9,0xda
                         ,0x99,0x83,0x2b,0x61,0xca,0x01,0xb6,0xde
                         ,0x56,0x24,0x4a,0x9e,0x88,0xd5,0xf9,0xb3
                         ,0x79,0x73,0xf6,0x22,0xa4,0x3d,0x14,0xa6
                         ,0x59,0x9b,0x1f,0x65,0x4c,0xb4,0x5a,0x74
                         ,0xe3,0x55,0xa5]);
    t.equivalent(n.box_open(box2_c, box2_nonce, box2_alicepk, box2_bobsk),
                 Buffer([0xbe,0x07,0x5f,0xc5,0x3c,0x81,0xf2,0xd5
                         ,0xcf,0x14,0x13,0x16,0xeb,0xeb,0x0c,0x7b
                         ,0x52,0x28,0xc5,0x2a,0x4c,0x62,0xcb,0xd4
                         ,0x4b,0x66,0x84,0x9b,0x64,0x24,0x4f,0xfc
                         ,0xe5,0xec,0xba,0xaf,0x33,0xbd,0x75,0x1a
                         ,0x1a,0xc7,0x28,0xd4,0x5e,0x6c,0x61,0x29
                         ,0x6c,0xdc,0x3c,0x01,0x23,0x35,0x61,0xf4
                         ,0x1d,0xb6,0x6c,0xce,0x31,0x4a,0xdb,0x31
                         ,0x0e,0x3b,0xe8,0x25,0x0c,0x46,0xf0,0x6d
                         ,0xce,0xea,0x3a,0x7f,0xa1,0x34,0x80,0x57
                         ,0xe2,0xf6,0x55,0x6a,0xd6,0xb1,0x31,0x8a
                         ,0x02,0x4a,0x83,0x8f,0x21,0xaf,0x1f,0xde
                         ,0x04,0x89,0x77,0xeb,0x48,0xf5,0x9f,0xfd
                         ,0x49,0x24,0xca,0x1c,0x60,0x90,0x2e,0x52
                         ,0xf0,0xa0,0x89,0xbc,0x76,0x89,0x70,0x40
                         ,0xe0,0x82,0xf9,0x37,0x76,0x38,0x48,0x64
                         ,0x5e,0x07,0x05]));

    // box3 is just a C++ variant of box[1]
    // box4 is just a C++ variant of box2

    // the NACL tests use 1000 iterations, which takes about 45s on my fast
    // laptop. To keep our TAP test-runner from timing out, we only run 100
    // iterations.

    for(var box5_mlen=0; box5_mlen < 100; box5_mlen++) {
        var box5_alicekeys = n.box_keypair();
        var box5_alicepk = box5_alicekeys[0];
        var box5_alicesk = box5_alicekeys[1];
        var box5_bobkeys = n.box_keypair();
        var box5_bobpk = box5_bobkeys[0];
        var box5_bobsk = box5_bobkeys[1];
        console.log(box5_mlen);
        var box5_nonce = Buffer(crypto.randomBytes(24), "binary");
        var box5_msg = Buffer(crypto.randomBytes(box5_mlen), "binary");
        var box5_c = n.box(box5_msg, box5_nonce, box5_bobpk, box5_alicesk);
        var box5_m2 = n.box_open(box5_c, box5_nonce, box5_alicepk, box5_bobsk);
        t.equivalent(box5_msg, box5_m2);
    }

    for(var box6_mlen=0; box6_mlen < 100; box6_mlen++) {
        var box6_alicekeys = n.box_keypair();
        var box6_alicepk = box6_alicekeys[0];
        var box6_alicesk = box6_alicekeys[1];
        var box6_bobkeys = n.box_keypair();
        var box6_bobpk = box6_bobkeys[0];
        var box6_bobsk = box6_bobkeys[1];
        console.log(box6_mlen);
        var box6_nonce = Buffer(crypto.randomBytes(24), "binary");
        var box6_msg = Buffer(crypto.randomBytes(box6_mlen), "binary");
        var box6_c = n.box(box6_msg, box6_nonce, box6_bobpk, box6_alicesk);
        for (var box6_caught=0; box6_caught < 10; box6_caught++) {
            // N.B. cumulative, that's how box6.cpp was written
            box6_c[Math.floor(Math.random()*box6_mlen)] = Math.floor(Math.random()*256);
            try {
                var box6_m2 = n.box_open(box6_c, box6_nonce, box6_alicepk, box6_bobsk);
                if (box6_msg.toString("hex") != box6_m2.toString("hex")) {
                    t.fail("forgery"); // scary+unhelpful
                    break;
                }
                // else we randomly fixed the message, ok
            } catch (e) {
                t.equal(e.message, "ciphertext fails verification");
            }
        }
    }

    // box7 is just a C variant of box5
    // box8 is just a C variant of box6

    t.end();
});
