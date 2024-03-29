#define FLICKER 1.



uniform sampler2D iTexture;
uniform float iTime;
uniform vec3 iResolution;
uniform vec2 iTextureResolution;
uniform sampler2D iFrameTexture;

#define sc (iResolution.x/600.)

vec2 roffs;
float ramp;
float rsc;

vec4 iColor;

vec2 uvSmooth(vec2 uv,vec2 res)
    {
        return uv+.6*sin(uv*res*PI2)/PI2/res;
    }

    vec4 getRand(vec2 pos)
    {
        vec2 uv=pos/iTextureResolution.xy;
     uv=uvSmooth(uv,iTextureResolution.xy);
        // return textureLod(iChannel1,uv,0.);
        return texture2D(iTexture, uv, 0.0);
    }


    // vec4 getRand(vec2 pos) {

    //     vec2 repeat = vec2(8.0,8.0);
    //     vec2 fuv = fract(pos * repeat);
    //     vec2 smooth_uv = repeat * vUv;
    //     vec4 duv = vec4(dFdx(smooth_uv), dFdy(smooth_uv));
    //     vec3 txl = textureGrad(iTexture, fuv, duv.xy, duv.zw).rgb;

    //    return vec4(txl, 1.0);
    // }



vec4 getCol(vec2 pos)
{
    vec4 r1 = (getRand((pos+roffs)*.05*rsc/sc+iTime*131.*FLICKER)-.5)*10.*ramp;
    return r1 * sc;
    // vec2 res0=iTextureResolution;
    // vec2 uv=(pos+r1.xy*sc)/iResolution.xy;
    // //uv=uvSmooth(uv,res0);
    // vec4 c = texture(iChannel0,uv);
    // vec4 bg= vec4(vec3(clamp(.3+pow(length(uv-.5),2.),0.,1.)),1);
    // bg=vec4(1);
    // //c = mix(c,bg,clamp(dot(c.xyz,vec3(-1,2,-1)*1.5),0.,1.));
    // float vign=pow(clamp(-.5+length(uv-.5)*2.,0.,1.),3.);
    // //c = mix(c,bg,vign);
    // return c;
}

    float getVal(vec2 pos)
{
    return clamp(dot(iColor.xyz,vec3(.333)),0.,1.);
}



vec2 getGrad(vec2 pos, float eps)
{
    vec2 d=vec2(eps,0);
    return vec2(
        getVal(pos+d.xy)-getVal(pos-d.xy),
        getVal(pos+d.yx)-getVal(pos-d.yx)
        )/eps/2.;
}


void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 fragColor)
    {
        iColor = inputColor;
        // subtraction of 2 rand values, so its [-1..1] and noise-wise not as white anymore
        vec4 r = getRand(uv*1.2/sqrt(sc))-getRand(uv*1.2/sqrt(sc)+vec2(1,-1)*1.5);
        // white noise
        vec4 r2 = getRand(uv*1.2/sqrt(sc));

        // outlines
        float br=0.;
        roffs = vec2(0.);
        ramp = .7;
        rsc=.7;
        int num=3;
        for(int i=0;i<num;i++)
        {
            float fi=float(i)/float(num-1);
            float t=.03+.25*fi, w=t*2.;
            // one closely matched edge-line
            ramp=.15*pow(1.3,fi*5.); rsc=1.7*pow(1.3,-fi*5.);
            br+=.6*(.5+fi)*smoothstep(t-w/2.,t+w/2.,length(getGrad(uv,.4*sc))*sc);
            // another wildly varying edge-line
            ramp=.3*pow(1.3,fi*5.); rsc=10.7*pow(1.3,-fi*5.);
            br+=.4*(.2+fi)*smoothstep(t-w/2.,t+w/2.,length(getGrad(uv,.4*sc))*sc);
            //roffs += vec2(13.,37.);
        }
        fragColor.xyz=vec3(1)-.7*br*(.5+.5*r2.z)*3./float(num);
        fragColor.xyz=clamp(fragColor.xyz,0.,1.);
    

        // cross hatch
        ramp=0.;
        int hnum=5;
        #define N(v) (v.yx*vec2(-1,1))
        #define CS(ang) cos(ang-vec2(0,1.6))
        float hatch = 0.;
        float hatch2 = 0.;
        float sum=0.;
        for(int i=0;i<hnum;i++)
        {
            float br=getVal(uv+1.5*sc*(getRand(uv*.02+iTime*1120.).xy-.5)*clamp(FLICKER,-1.,1.))*1.7;
            // chose the hatch angle to be prop to i*i
            // so the first 2 hatches are close to the same angle, 
            // and all the higher i's are fairly random in angle
            float ang=-.5-.08*float(i)*float(i);
            vec2 uvh=mat2(CS(ang),N(CS(ang)))*uv/sqrt(sc)*vec2(.05,1)*1.3;
            vec4 rh = pow(getRand(uvh+1003.123*iTime*FLICKER+vec2(sin(uvh.y),0)),vec4(1.));
            hatch += 1.-smoothstep(.5,1.5,(rh.x)+br)-.3*abs(r.z);
            hatch2 = max(hatch2, 1.-smoothstep(.5,1.5,(rh.x)+br)-.3*abs(r.z));
            sum+=1.;
            if( float(i)>(1.-br)*float(hnum) && i>=2 ) break;
        }
    
        fragColor.xyz*=1.-clamp(mix(hatch/sum,hatch2,.5),0.,1.);
        

        fragColor.xyz=1.-((1.-fragColor.xyz)*.7);

        fragColor.xyz *= .95+.06*r.xxx+.06*r.xyz;
        fragColor.w = 1.;

        if(true)
            {
                vec2 scc=(uv-.5*iResolution.xy)/iResolution.x;
                float vign = 1.-.3*dot(scc,scc);
                vign*=1.-.7*exp(-sin(uv.x/iResolution.x*3.1416)*40.);
                vign*=1.-.7*exp(-sin(uv.y/iResolution.y*3.1416)*20.);
                fragColor.xyz *= vign;
            }
        //fragColor = texture2D(iFrameTexture, vUv, 0.0);
        //fragColor = getRand(vUv);
        //fragColor = vec4(getVal(uv), getVal(uv),getVal(uv), 1.0);

    }